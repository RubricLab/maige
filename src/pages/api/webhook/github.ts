import type { NextApiRequest, NextApiResponse } from "next/types";
import { App } from "@octokit/app";
import prisma from "~/lib/prisma";
import { Label, Repository } from "~/lib/types";
import { addComment, labelIssue, openUsageIssue } from "~/lib/utils/github";
import { getLabelsFromGPT, mergeInstructions } from "~/lib/utils/openai";
import { incrementUsage } from "~/lib/utils/payment";
import { stripe } from "~/lib/stripe";
import { validateSignature } from "~/lib/utils";

/**
 * POST /api/webhook
 *
 * This is the webhook that GitHub calls.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

      console.log(`Added customer ${login}`);
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
        console.warn(error);
      }

      console.warn(`Deleted customer ${login}`);
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

  const {
    issue: { node_id: issueId, title, body, labels: existingLabels },
    repository: {
      node_id: repoId,
      name,
      owner: { login: owner },
    },
    installation: { id: instanceId },
  } = req.body;

  const existingLabelNames = existingLabels?.map((l: Label) => l.name);

  const customer = await prisma.customer.findUnique({
    where: {
      name: owner || undefined,
    },
    select: {
      id: true,
      usage: true,
      usageLimit: true,
      usageWarned: true,
      projects: {
        where: {
          name: req.body?.repository?.name,
        },
        select: {
          name: true,
          customInstructions: true,
        },
      },
    },
  });

  if (!customer) {
    console.warn("Could not find customer: ", owner);
    return res.status(500).send({
      message: "Could not find customer",
    });
  }

  const { id: customerId, usage, usageLimit, usageWarned, projects } = customer;
  const { customInstructions } = projects?.[0] || { customInstructions: "" };

  /**
   * Relevant issue events. Label issues.
   */

  // Get GitHub app instance access token
  const app = new App({
    appId: process.env.GITHUB_APP_ID || "",
    privateKey: process.env.GITHUB_PRIVATE_KEY || "",
  });

  const octokit = await app.getInstallationOctokit(instanceId);

  /**
   * Usage limit-gating:
   * Warn user twice with grace period, then discontinue usage.
   */
  if (usage > usageLimit) {
    if (!usageWarned || usage == usageLimit + 10) {
      try {
        await openUsageIssue(stripe, octokit, customerId, repoId);
        await prisma.customer.update({
          where: {
            id: customerId,
          },
          data: {
            usageWarned: true,
          },
        });
        console.log("Usage issue opened for: ", owner, name);
      } catch (error) {
        console.warn("Could not open usage issue for: ", owner, name);
        console.error(error);
        return res.status(500).send({
          message: "Could not open usage issue",
        });
      }
    }

    // Only block usage after grace period
    if (usage > usageLimit + 10) {
      console.warn("Usage limit exceeded for: ", owner, name);
      return res.status(402).send({
        message: "Please add payment info to continue.",
      });
    }
  }

  /**
   * Label one old issue, triggered by a comment containing "maige"
   */
  if (req.body?.comment) {
    if (!req.body.comment?.body?.toLowerCase?.()?.includes("maige")) {
      console.log("Irrelevant comment received");
      return res.status(202).send({
        message: "Irrelevant comment received",
      });
    }

    if (req.body.comment.author_association === "NONE") {
      console.log("Comment from non-collaborator received");
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
  const commentBody = req.body.comment?.body;
  if (commentBody?.includes("label all")) {
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
          existingLabelNames,
          customInstructions,
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

    console.log("Labels added to all old issues.");
    return res.status(200).send({
      message: "Labels added to all old issues.",
    });
  } else if (commentBody?.includes("label this") || !commentBody) {
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
        existingLabelNames,
        customInstructions,
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
  } else {
    /**
     * Update custom instructions
     */
    try {
      const combinedInstructions = await mergeInstructions({
        newInstructions: commentBody,
        oldInstructions: customInstructions,
        issueBody: body,
        issueLabels: existingLabelNames,
      });

      await prisma.project.update({
        where: {
          customerId_name: {
            customerId: customerId,
            name: name,
          },
        },
        data: {
          customInstructions: combinedInstructions,
        },
      });

      await addComment(
        octokit,
        issueId,
        `Here are your new instructions:\n\n> ${combinedInstructions}\n\nFeel free to provide feedback.`
      );

      console.log("Custom instructions updated.");
      return res.status(200).send({
        message: "Custom instructions updated.",
      });
    } catch (error: any) {
      console.warn("Could not update custom instructions: ", error.message);
      return res.status(500).send({
        message: error.message || "Could not update custom instructions",
      });
    }
  }
};

export default handler;
