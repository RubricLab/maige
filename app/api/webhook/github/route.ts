import { App } from "@octokit/app";
import prisma from "lib/prisma";
import { Label, Repository } from "lib/types";
import { addComment, labelIssue, openUsageIssue } from "lib/utils/github";
import { askGPT, getLabelsFromGPT, mergeInstructions } from "lib/utils/openai";
import { incrementUsage } from "lib/utils/payment";
import { stripe } from "lib/stripe";
import { truncate, validateSignature } from "lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { MAX_BODY_LENGTH } from "lib/constants";

export const maxDuration = 30;

/**
 * POST /api/webhook
 *
 * GitHub webhook handler
 */
export const POST = async (req: NextRequest) => {
  // Verify webhook signature
  const text = await req.text();
  const signature = req.headers.get("x-hub-signature-256") || "";

  const validSignature = await validateSignature(text, signature);
  if (!validSignature) {
    console.error("Bad GitHub webhook secret.");
    return NextResponse.json(
      {
        message: "Bad GitHub webhook secret.",
      },
      { status: 403 }
    );
  }

  const payload = JSON.parse(text);
  const { action } = payload;

  /**
   * Installation-related events. Sync repos/user to database.
   */
  if (payload?.installation?.account?.login) {
    const {
      installation: {
        account: { login },
      },
    } = payload;

    if (action === "created") {
      // Installed GitHub App

      const { repositories } = payload;

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
      return NextResponse.json({
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
      return NextResponse.json({
        message: `Deleted customer ${login}`,
      });
    } else if (["added", "removed"].includes(action)) {
      // Added or removed repos from GitHub App

      const {
        repositories_added: addedRepos,
        repositories_removed: removedRepos,
      } = payload;

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
        return NextResponse.json(
          {
            message: `Could not find or create customer ${login}`,
          },
          { status: 500 }
        );
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

      return NextResponse.json({
        message: `Updated repos for ${login}`,
      });
    }
  }

  /**
   * Issue-related events. We care about new issues and comments.
   */
  if (
    !(
      (action === "opened" && payload?.issue) ||
      (action === "created" && payload?.comment)
    )
  ) {
    return NextResponse.json({
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
    sender: { login: sender },
    installation: { id: instanceId },
  } = payload;

  /**
   * Ignore comments by Maige
   */
  if (sender.includes("maige-bot")) {
    return new NextResponse("Comment by Maige");
  }

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
          name: payload?.repository?.name,
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
    return NextResponse.json(
      {
        message: "Could not find customer",
      },
      { status: 500 }
    );
  }

  const { id: customerId, usage, usageLimit, usageWarned, projects } = customer;
  const { customInstructions } = projects?.[0] || { customInstructions: "" };

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
        return NextResponse.json(
          {
            message: "Could not open usage issue",
          },
          { status: 500 }
        );
      }
    }

    // Only block usage after grace period
    if (usage > usageLimit + 10) {
      console.warn("Usage limit exceeded for: ", owner, name);
      return NextResponse.json(
        {
          message: "Please add payment info to continue.",
        },
        { status: 402 }
      );
    }
  }

  /**
   * Repo commands
   */
  try {
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
      return NextResponse.json(
        { message: "Could not get labels" },
        { status: 401 }
      );
    }

    const labels: Label[] = labelsRes.repository.labels.nodes;
    const { description: repoDescription } = labelsRes.repository;

    const commentBody = payload.comment?.body;

    /**
     * Label new issue
     */
    if (!commentBody) {
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

      return NextResponse.json({
        message: "Webhook received. Labels added.",
      });
    }

    console.warn(
      `Comment by a ${payload.comment?.author_association} in ${owner}/${name}`
    );
    console.warn(
      `Comment includes 'maige': ${commentBody.toLowerCase().includes("maige")}`
    );

    if (["MEMBER", "OWNER"].includes(payload.comment?.author_association)) {
      /**
       * Repo owner-scoped actions
       */

      /**
       * Label all unlabelled issues
       */
      if (commentBody.toLowerCase().includes("maige label all")) {
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
          return NextResponse.json(
            {
              message: "Could not get open issues",
            },
            { status: 401 }
          );
        }

        const unlabelledIssues = openIssues.repository.issues.nodes.filter(
          (issue: any) => issue.labels.totalCount === 0
        );

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

        return NextResponse.json({
          message: "Labels added to all old issues.",
        });
      } else if (commentBody.toLowerCase().includes("maige label this")) {
        /**
         * Label one issue
         */
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

        return NextResponse.json({
          message: "Webhook received. Labels added.",
        });
      } else if (commentBody.toLowerCase().includes("maige")) {
        /**
         * Update custom instructions
         */
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
          `Here is your custom prompt:\n\n> ${combinedInstructions}\n\nShare feedback by commenting.`
        );

        return NextResponse.json({
          message: "Custom instructions updated.",
        });
      }
    } else {
      /**
       * Community comment; allow GPT to reply if instructed.
       */
      const commentSample = truncate(commentBody, MAX_BODY_LENGTH);

      const prompt = `
You are Maige, an AI codebase manager. You can currently label issues and reply to comments.
A community member has commented. The codebase owner has some special instructions for you.
Read the instructions and decide whether to reply to this comment.
Ready? Take a deep breath.
Instructions: ${customInstructions}.
Comment: ${commentSample}.

If the instructions do not explicitly apply to the comment, reply "n/a".
`;
      const comment = await askGPT({
        prompt,
        model: "gpt-4",
        temperature: 0.6,
      });

      // TODO: replace this with a tool passed to a LangChain Agent
      if (comment.length > 20) {
        await addComment(octokit, issueId, comment);
      }
    }

    return new NextResponse("ok");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: `Something went wrong: ${error}`,
      },
      { status: 500 }
    );
  }
};
