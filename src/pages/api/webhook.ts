import type { NextApiRequest, NextApiResponse } from "next/types";
import { CreateChatCompletionRequest } from "openai";
import { createHmac, timingSafeEqual } from "crypto";
import { App } from "@octokit/app";

type Label = {
  id: string;
  name: string;
};

const ISSUE_TYPES = ["bug", "feature", "question"];
const PRIORITY_LEVELS = ["low", "medium", "high"];
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
 * GET /api/webhook
 *
 * This is the webhook that GitHub will call when an issue is created or updated.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).send({
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

  if (!req.body?.issue || !req.body?.repository) {
    return res.status(400).send({
      message: "Missing body or details",
    });
  }

  // Extract issue details
  const {
    action,
    issue: { node_id: issueId, title, body },
    repository: {
      name,
      owner: { login: owner },
    },
    installation: { id: instanceId },
  } = req.body;

  if (!["opened", "edited"].includes(action)) {
    return res.status(200).send({
      message: "Webhook received",
    });
  }

  // Truncate body if it's too long
  const bodySample =
    body.length > MAX_BODY_LENGTH
      ? body.slice(0, MAX_BODY_LENGTH) + "..."
      : body;

  const prompt = `
  You are tasked with labelling a GitHub issue based on its title and body.
  The repository is called ${name} owned by ${owner}.
  Would this issue be low, medium, or high priority? Is this issue a bug, feature request, or question?
  
  Title: ${title}
  Body: "${bodySample}"

  Please answer in the format \`type, priority\`, with no explanation. For example, "bug, high".
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

  if (!answer.includes(",")) {
    return res.status(500).send({
      message: `GPT answered in an unknown format: ${answer}`,
    });
  }

  // Extract issue type and priority from GPT answer
  const issueType = answer.split(",")[0].trim();
  const priority = answer.split(",")[1].trim();

  if (!ISSUE_TYPES.includes(issueType) || !PRIORITY_LEVELS.includes(priority)) {
    return res.status(500).send({
      message: `GPT answered with an unknown issue type or priority: ${issueType}, ${priority}`,
    });
  }

  // Get GitHub app instance access token
  const app = new App({
    appId: process.env.GITHUB_APP_ID || "",
    privateKey: process.env.GITHUB_PRIVATE_KEY || "",
  });

  const octokit = await app.getInstallationOctokit(instanceId);

  // Search for an appropriate label
  const labels: {
    repository: {
      labels: {
        nodes: Label[];
      };
    };
  } = await octokit.graphql(
    `
    query Labels($name: String!, $owner: String!) { 
      repository(name: $name, owner: $owner) {
        labels(first: 50) {
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
      issueType,
    }
  );

  if (!labels?.repository?.labels?.nodes) {
    return res.status(500).send({
      message: "Could not get labels",
    });
  }

  // Find the label IDs for the issue type and priority
  const issueTypeLabel = labels.repository.labels.nodes.find((label: Label) =>
    label.name.toLowerCase().includes(issueType)
  );
  const issuePriorityLabel = labels.repository.labels.nodes.find(
    (label: Label) => label.name.toLowerCase().includes(priority)
  );

  if (!issueTypeLabel || !issuePriorityLabel) {
    return res.status(500).send({
      message: "Could not find appropriate labels",
    });
  }

  const labelResult = await octokit.graphql(
    `
    mutation AddLabels($issueId: ID!, $issueTypeId: ID!, $issuePriorityId: ID!) {
      addLabelsToLabelable(input: {
        labelIds: [$issueTypeId, $issuePriorityId], labelableId: $issueId
      }) {
        clientMutationId
      }
    }
    `,
    {
      issueId,
      issueTypeId: issueTypeLabel?.id,
      issuePriorityId: issuePriorityLabel?.id,
    }
  );

  if (!labelResult) {
    return res.status(500).send({
      message: "Could not add labels",
    });
  }

  return res.status(200).send({
    message: "Webhook received. Labels added.",
  });
};
