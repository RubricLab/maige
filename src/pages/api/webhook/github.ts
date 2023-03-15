import type { NextApiRequest, NextApiResponse } from "next/types";
import { CreateChatCompletionRequest } from "openai";
import { createHmac, timingSafeEqual } from "crypto";
import { App } from "@octokit/app";
import prisma from "~/lib/prisma";

type Label = {
  id: string;
  name: string;
};

type Repository = {
  id: string;
  name: string;
  full_name: string;
  private: boolean;
};

const MAX_BODY_LENGTH = 2000;

// Validate the GitHub webhook signature
const validateSignature = (req: NextApiRequest): boolean => {
  const signature = req.headers["x-hub-signature-256"] as string;
  const HMAC = createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET || "");
  const digest = Buffer.from(
    `sha256=${HMAC.update(JSON.stringify(req.body)).digest("hex")}`,
    "utf-8"
  );
  const signatureBuffer = Buffer.from(signature, "utf-8");
  const isValid = timingSafeEqual(digest, signatureBuffer);

  return isValid;
};

/**
 * POST /api/webhook
 *
 * This is the webhook that GitHub will call when an issue is created or updated.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).send({
      message: "Only POST requests are accepted.",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).send({
      message: "Missing OpenAI API key",
    });
  }

  // Verify webhook signature
  const validSignature = validateSignature(req);
  if (!validSignature) {
    return res.status(403).send({
      message: "Bad GitHub webhook secret.",
    });
  }

  const { action } = req.body;

  // Update a customer in the database
  if (action === "created") {
    const {
      installation: {
        account: { login },
      },
      repositories,
    } = req.body;

    await prisma.customer.create({
      data: {
        name: login,
        projects: {
          create: repositories.map((repo: Repository) => ({
            name: repo.name,
          })),
        },
      },
    });

    return res.status(200).send({
      message: `Added customer ${login}`,
    });
  } else if (action === "deleted") {
    const {
      installation: {
        account: { login },
      },
    } = req.body;

    try {
      await prisma.customer.delete({
        where: {
          name: login,
        },
      });
    } catch (error) {
      console.log(error);
    }

    return res.status(200).send({
      message: `Deleted customer ${login}`,
    });
  } else if (["added", "removed"].includes(action)) {
    const {
      installation: {
        account: { login },
      },
      repositories_added: addedRepos,
      repositories_removed: removedRepos,
    } = req.body;

    const customer = await prisma.customer.upsert({
      where: {
        name: login,
      },
      create: {
        name: login,
      },
      update: {},
      select: {
        id: true,
        projects: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!customer?.id) {
      return res.status(500).send({
        message: `Could not find or create customer ${login}`,
      });
    }

    // Add new repos to the database
    const newRepos = addedRepos.filter((repo: Repository) => {
      return !customer.projects.some(
        (project: { name: string }) => project.name === repo.name
      );
    });

    const createProjects = prisma.project.createMany({
      data: newRepos.map((repo: Repository) => ({
        name: repo.name,
        customerId: customer.id,
      })),
      skipDuplicates: true,
    });

    // Delete removed repos from the database
    const deleteProjects = prisma.project.deleteMany({
      where: {
        customerId: customer.id,
        name: {
          in: removedRepos.map((repo: Repository) => repo.name),
        },
      },
    });

    await prisma.$transaction([createProjects, deleteProjects]);

    return res.status(200).send({
      message: `Updated repos for ${login}`,
    });
  }

  if (action !== "opened" || !req.body?.issue) {
    return res.status(200).send({
      message: "Webhook received",
    });
  }

  // Extract issue details
  const {
    issue: { node_id: issueId, title, body },
    repository: {
      name,
      owner: { login: owner },
    },
    installation: { id: instanceId },
  } = req.body;

  // Get GitHub app instance access token
  const app = new App({
    appId: process.env.GITHUB_APP_ID || "",
    privateKey: process.env.GITHUB_PRIVATE_KEY || "",
  });

  const octokit = await app.getInstallationOctokit(instanceId);

  // List labels
  const labelsRes: {
    repository: {
      labels: {
        nodes: Label[];
      };
    };
  } = await octokit.graphql(
    `
    query Labels($name: String!, $owner: String!) { 
      repository(name: $name, owner: $owner) {
        labels(first: 100) {
          nodes {
            name
            id
          }
        }
      }
    }
  `,
    {
      name,
      owner,
    }
  );

  if (!labelsRes?.repository?.labels?.nodes) {
    return res.status(500).send({
      message: "Could not get labels",
    });
  }

  const labels: Label[] = labelsRes.repository.labels.nodes;

  // Truncate body if it's too long
  const bodySample =
    body?.length > MAX_BODY_LENGTH
      ? body.slice(0, MAX_BODY_LENGTH) + "..."
      : body;

  const prompt = `
  You are tasked with labelling a GitHub issue based on its title and body.
  The repository is called ${name} owned by ${owner}.
  The possible labels are: ${labels.map((l) => l.name).join(", ")}.
  Please choose up to three labels.
  The first label should be a type of issue (bug, feature request, or question).
  The second label should identify low-priority issues, for example, low or medium priority. Do not use high priority, urgent, etc.
  The third label, if available, should be a category describing the issue, eg. frontend, API, dashboard.
  
  Title: ${title}
  Body: "${bodySample}"

  Please answer in the format \`type, priority, category\`, with no explanation. For example: "bug, medium, backend".
  `;

  // Assemble OpenAI request
  const payload: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    n: 1,
  };

  const completionRes = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!completionRes.ok) {
    return res.status(500).send({
      message: `OpenAI API error: ${completionRes.status}`,
    });
  }

  const { choices } = await completionRes.json();
  const answer = choices[0].message.content;

  console.log(`GPT's answer: ${answer}`);

  if (!answer.includes(",")) {
    return res.status(500).send({
      message: `GPT answered in an unknown format: ${answer}`,
    });
  }

  // Extract labels from GPT answer
  const gptLabels: string[] = answer
    .split(",")
    .map((l: string) => l.trim().toLowerCase());

  const labelIds: string[] = labels
    .filter((l: Label) => gptLabels.includes(l.name.toLowerCase()))
    .map((l: Label) => l?.id);

  const labelResult = await octokit.graphql(
    `
    mutation AddLabels($issueId: ID!, $labelIds: [ID!]!) {
      addLabelsToLabelable(input: {
        labelIds: $labelIds, labelableId: $issueId
      }) {
        clientMutationId
      }
    }
    `,
    {
      issueId,
      labelIds,
    }
  );

  if (!labelResult) {
    return res.status(500).send({
      message: "Could not add labels",
    });
  }

  // Increment usage count
  await prisma.customer.update({
    where: {
      name: owner,
    },
    data: {
      usage: {
        increment: 1,
      },
      usageUpdatedAt: new Date(),
    },
  });

  return res.status(200).send({
    message: "Webhook received. Labels added.",
  });
};
