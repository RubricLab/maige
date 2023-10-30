import { App } from "@octokit/app";
import prisma from "lib/prisma";
import { Label, Repository } from "lib/types";
import { openUsageIssue } from "lib/utils/github";
import { incrementUsage } from "lib/utils/payment";
import { stripe } from "lib/stripe";
import { validateSignature } from "lib/utils";
import engineer from "lib/agents/engineer";

export const maxDuration = 15;

/**
 * POST /api/webhook
 *
 * GitHub webhook handler
 */
export const POST = async (req: Request) => {
  // Verify webhook signature
  const text = await req.text();
  const signature = req.headers.get("x-hub-signature-256") || "";

  const validSignature = await validateSignature(text, signature);
  if (!validSignature) {
    console.error("Bad GitHub webhook secret.");
    return new Response("Bad GitHub webhook secret.", { status: 403 });
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

      return new Response(`Added customer ${login}`);
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

      return new Response(`Deleted customer ${login}`);
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
        return new Response(`Could not find or create customer ${login}`, {
          status: 500,
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

      return new Response(`Successfully updated repos for ${login}`);
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
    return new Response("Webhook received", { status: 202 });
  }

  const {
    issue: {
      node_id: issueId,
      title,
      number: issueNumber,
      body,
      labels: existingLabels,
    },
    repository: {
      node_id: repoId,
      name,
      owner: { login: owner },
    },
    sender: { login: sender },
    installation: { id: instanceId },
    comment,
  } = payload;

  if (sender.includes("maige-bot")) {
    return new Response("Comment by Maige", { status: 202 });
  }

  if (comment && !comment.body.toLowerCase().includes("maige")) {
    return new Response("Irrelevant comment", { status: 202 });
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
    return new Response("Could not find customer", { status: 500 });
  }

  const { id: customerId, usage, usageLimit, usageWarned, projects } = customer;
  const instructions = projects?.[0]?.customInstructions || "";

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
        return new Response("Could not open usage issue", { status: 500 });
      }
    }

    // Only block usage after grace period
    if (usage > usageLimit + 10) {
      console.warn("Usage limit exceeded for: ", owner, name);
      return new Response("Please add payment info to continue.", {
        status: 402,
      });
    }
  }

  await incrementUsage(prisma, owner);

  /**
   * Repo commands
   */
  try {
    const queryRes: {
      repository: {
        description?: string;
      };
    } = await octokit.graphql(
      `
        query Repo($name: String!, $owner: String!) {
          repository(name: $name, owner: $owner) {
            description
          }
        }
      `,
      {
        name,
        owner,
      }
    );

    if (!queryRes?.repository?.description) {
      return new Response("Could not get repo", { status: 401 });
    }

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
      throw new Error("Could not get labels");
    }

    const allLabels: Label[] = labelsRes.repository.labels.nodes;

    console.log(
      `Comment by ${comment?.author_association} in ${owner}/${name}`
    );

    const { description: repoDescription } = queryRes.repository;

    const isComment = action === "created";

    // Note: issue number has been omitted
    const engPrompt = `
Hey, here's an incoming ${isComment ? "comment" : "issue"}.
First, some context:
Repo owner: ${owner}.
Repo name: ${name}.
Repo description: ${repoDescription}.
All repo labels: ${allLabels
      .map(
        ({ name, description }) =>
          `${name}: ${description?.replaceAll(";", ",")}`
      )
      .join("; ")}.
Issue ID: ${issueId}.
Issue number: ${issueNumber}.
Issue title: ${title}.
Issue body: ${body}.
Issue labels: ${existingLabelNames.join(", ")}.
Your instructions: ${instructions}.
${isComment ? `Comment by @${comment.user.login}: ${comment?.body}.` : ""}
`.replaceAll("\n", " ");

    await engineer({
      input: engPrompt,
      octokit,
      prisma,
      customerId,
      owner: name,
    });

    return new Response("ok");
  } catch (error) {
    console.error(error);
    return new Response(`Something went wrong: ${error}`, { status: 500 });
  }
};
