import type { NextApiRequest, NextApiResponse } from "next/types";
import { CreateChatCompletionRequest } from "openai";
import { createHmac, timingSafeEqual } from "crypto";
import { App } from "@octokit/app";
import prisma from "~/lib/prisma";
import { createPaymentLink } from "../stripe/generate-payment-link";
import { PrismaClient } from "@prisma/client";

type Label = {
  id: string;
  name: string;
  description: string;
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
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
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

  /**
   * Installation-related events. Sync repos/user to database.
   */
  if (req.body?.installation?.account?.login) {
    const {
      installation: {
        account: { login },
      },
    } = req.body;

    if (action === "created") {
      // Installed GitHub App

      const { repositories } = req.body;

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
      // Uninstalled GitHub App

      try {
        await prisma.customer.delete({
          where: {
            name: login,
          },
        });
      } catch (error) {
        console.log(error);
      }

      return res.status(201).send({
        message: `Deleted customer ${login}`,
      });
    } else if (["added", "removed"].includes(action)) {
      // Added or removed repos from GitHub App

      const {
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

      const deleteProjects = prisma.project.deleteMany({
        where: {
          customerId: customer.id,
          name: {
            in: removedRepos.map((repo: Repository) => repo.name),
          },
        },
      });

      // Sync repos to database in a single transaction
      await prisma.$transaction([createProjects, deleteProjects]);

      return res.status(201).send({
        message: `Updated repos for ${login}`,
      });
    }
  }

  /**
   * Issue-related events. We care about new issues and comments.
   */
  if (
    !(
      (action === "opened" && req.body?.issue) ||
      (action === "created" && req.body?.comment)
    )
  ) {
    return res.status(202).send({
      message: "Webhook received",
    });
  }

  const customer = await prisma.customer.findUnique({
    where: {
      name: req.body?.repository?.owner?.login,
    },
    select: {
      id: true,
      usage: true,
      usageLimit: true,
      usageWarned: true,
    },
  });

  if (!customer) {
    console.warn(
      "Could not find customer: ",
      req.body?.repository?.owner?.login
    );
    return res.status(500).send({
      message: "Could not find customer",
    });
  }

  const { id: customerId, usage, usageLimit, usageWarned } = customer;

  /**
   * Relevant issue events. Label issues.
   */

  const {
    issue: { node_id: issueId, title, body },
    repository: {
      node_id: repoId,
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

  // Above usage. Warn user twice but continue (for now).
  if (usage > usageLimit) {
    if (!usageWarned || usage == usageLimit + 10) {
      try {
        await openUsageIssue(octokit, customerId, repoId);
        await prisma.customer.update({
          where: {
            id: customerId,
          },
          data: {
            usageWarned: true,
          },
        });
        console.log("Usage issue opened: ", owner, name);
      } catch (error) {
        console.warn("Could not open usage issue for: ", owner, name);
        console.error(error);
        return res.status(500).send({
          message: "Could not open usage issue",
        });
      }
    }

    // console.warn("Usage limit exceeded:", owner, name);
    // return res.status(402).send({
    //   message: "Please add payment info to continue.",
    // });
  }

  /**
   * Label one old issue, triggered by a comment "/label" or "/label-all"
   */
  if (req.body?.comment) {
    if (!req.body.comment.body?.includes("/label")) {
      return res.status(202).send({
        message: "Non-label comment received",
      });
    }

    if (req.body.comment.author_association === "NONE") {
      return res.status(202).send({
        message: "Comment from non-collaborator received",
      });
    }
  }

  // List labels
  const labelsRes: {
    repository: {
      description?: string;
      labels: {
        nodes: Label[];
      };
    };
  } = await octokit.graphql(
    `
    query Labels($name: String!, $owner: String!) { 
      repository(name: $name, owner: $owner) {
        description
        labels(first: 100) {
          nodes {
            id
            name
            description
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
    return res.status(401).send({
      message: "Could not get labels",
    });
  }

  const labels: Label[] = labelsRes.repository.labels.nodes;
  const repoDescription = labelsRes.repository.description;

  /**
   * Label all unlabelled issues
   */
  if (req.body.comment?.body?.includes("/label-all")) {
    console.log("Labelling all unlabelled issues");

    // GraphQL query to get all open issues. Filtering by unlabelled was not possible.
    const openIssues = (await octokit.graphql(
      `
      query UnlabelledIssues($name: String!, $owner: String!) {
        repository(name: $name, owner: $owner) {
          issues(first: 100, states: [OPEN]) {
            nodes {
              title
              body
              id
              labels(first: 1) {
                totalCount
              }
            }
          }
        }
      }
      `,
      {
        name: name,
        owner: owner,
      }
    )) as any;

    if (!openIssues?.repository?.issues?.nodes) {
      console.log("Could not get open issues");
      return res.status(401).send({
        message: "Could not get open issues",
      });
    }

    const unlabelledIssues = openIssues.repository.issues.nodes.filter(
      (issue: any) => issue.labels.totalCount === 0
    );

    try {
      for (const issue of unlabelledIssues) {
        const labelIdsToApply = await getLabelsFromGPT({
          title: issue.title,
          body: issue.body,
          labels,
          owner,
          name,
          repoDescription,
        });

        await labelIssue(octokit, labelIdsToApply, issue.id);
        await incrementUsage(prisma, owner);
      }
    } catch (error: any) {
      console.log("Could not label issue:", error.message);
      return res.status(500).send({
        message: error.message || "Could not label issue",
      });
    }

    return res.status(200).send({
      message: "Labels added to all old issues.",
    });
  }

  /**
   * Label one issue
   */
  try {
    const labelIdsToApply = await getLabelsFromGPT({
      title,
      body,
      labels,
      owner,
      name,
      repoDescription,
    });

    await labelIssue(octokit, labelIdsToApply, issueId);
    await incrementUsage(prisma, owner);
  } catch (error: any) {
    console.warn("Could not label issue:", error.message);
    return res.status(500).send({
      message: error.message || "Could not label issue",
    });
  }

  console.log("Webhook received. Labels added.");
  return res.status(200).send({
    message: "Webhook received. Labels added.",
  });
};

/**
 * Ask GPT for labels by title, body, and possible labels
 */
export async function getLabelsFromGPT({
  title,
  body,
  owner,
  name,
  labels,
  repoDescription,
}: {
  title: string;
  body: string;
  owner: string;
  name: string;
  labels: Label[];
  repoDescription?: string;
}): Promise<string[]> {
  // Truncate body if it's too long
  const bodySample =
    body?.length > MAX_BODY_LENGTH
      ? body.slice(0, MAX_BODY_LENGTH) + "..."
      : body;

  const prompt = `
You are tasked with labelling a GitHub issue based on its title and body.
The repository is ${name} by ${owner}${
    repoDescription ? `, described as follows: ${repoDescription}` : ""
  }
The possible labels are as follows:
${labels
  .map((l: Label) => `- ${l.name}${l.description ? `: ${l.description}` : ""}`)
  .join("\n")}

Please choose 1-2 of these labels.
The first is for the type of issue, examples: bug, feature request, or question.
The second label represents the code area affected, if available and applicable. Avoid "needs design" or other prescriptive labels.

Here is the title of the issue: "${title}"
Here is the body of the issue: "${bodySample}"

Please answer in the format "type, category" with only the names of the labels, without explanation.
Example: bug, frontend
Example: feature request, devOps
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
    throw new Error(`OpenAI API error: ${completionRes.status}`);
  }

  const { choices } = await completionRes.json();
  const answer = choices?.[0]?.message?.content;

  if (!answer || answer?.length === 0) {
    throw new Error("OpenAI API error: no answer");
  }

  // Extract labels from GPT answer
  const gptLabels: string[] = answer
    .split(",")
    // Remove quotes, whitespace, and lowercase
    .map((l: string) => l.trim().toLowerCase().replace(/['"]+/g, ""));

  const labelIds: string[] = gptLabels.reduce(
    (acc: string[], g: string) =>
      labels.some((l: Label) => l.name.toLowerCase().includes(g))
        ? [
            ...acc,
            labels.find((l: Label) => l.name.toLowerCase().includes(g))!.id,
          ]
        : acc,
    []
  );

  return labelIds;
}

/**
 * Increment usage count for a customer
 */
export async function incrementUsage(prisma: PrismaClient, owner: string) {
  await prisma.customer.update({
    where: {
      name: owner,
    },
    data: {
      usage: {
        increment: 1,
      },
      totalUsage: {
        increment: 1,
      },
      usageUpdatedAt: new Date(),
    },
  });
}

/**
 * Label an issue
 */
export async function labelIssue(
  octokit: any,
  labelIds: string[],
  issueId: number
) {
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
      labelIds: labelIds && labelIds.length > 0 ? labelIds : [],
    }
  );

  if (!labelResult) {
    throw new Error("Could not add labels");
  }
}

/**
 * Open issue to prompt user to add payment info
 */
export async function openUsageIssue(
  octokit: any,
  customerId: string,
  repoId: string
) {
  const paymentLink = await createPaymentLink(customerId, "base");
  const warningIssue = await octokit.graphql(
    `
      mutation($repoId: ID!, $title: String!, $body: String!) {
        createIssue(input: { repositoryId: $repoId, title: $title, body: $body }) {
          issue { id }
        }
      }
      `,
    {
      repoId,
      title: "Maige Usage",
      body:
        "Thanks for trying [Maige](https://maige.app).\n\n" +
        "Running GPT-based services is pricey. At this point, we ask you to add payment info to continue using Maige.\n\n" +
        `[Add payment info](${paymentLink})\n\n` +
        "Feel free to close this issue.",
    }
  );

  if (!warningIssue) {
    console.warn("Failed to open usage issue: ", warningIssue);
    throw new Error("Failed to open usage issue.");
  }
}

export default handle;
