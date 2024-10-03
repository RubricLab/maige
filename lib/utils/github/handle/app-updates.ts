import type {
	InstallationRepositoriesAddedEvent,
	InstallationRepositoriesRemovedEvent,
} from "@octokit/webhooks-types";
import prisma from "~/prisma";
import type { Repository } from "~/types";
import { getInstallationId, getInstallationToken } from "~/utils/github";
import Weaviate from "../../embeddings/db";
import { getMainBranch } from "../../github";

/**
 * Handles if a repository(s) is added or removed for an existing installation
 */
export default async function handleAppUpdates({
	payload,
}: {
	payload:
		| InstallationRepositoriesAddedEvent
		| InstallationRepositoriesRemovedEvent;
}) {
	const {
		repositories_added: addedRepos,
		repositories_removed: removedRepos,
		installation: {
			account: {
				id: githubOrgId,
				login: githubOrgSlug,
				avatar_url: githubOrgImage,
				type,
			},
		},
		sender: { id: githubUserId, login: userName },
	} = payload;

	// Get user & request to add project
	// TODO: Only use githubUserId eventually & replace with findUnique since userNames are mutable (added as a fallback for users before the migration) (Feb 2, 2024)
	const user = await prisma.user.findFirst({
		where: {
			OR: [{ githubUserId: githubUserId.toString() }, { userName: userName }],
		},
		select: {
			id: true,
			addProject: {
				take: 1,
				orderBy: { createdAt: "desc" },
			},
		},
	});

	if (!user?.id)
		return new Response(`Could not find user ${userName}`, {
			status: 404,
		});

	if (!user.addProject[0])
		return new Response(`Could not find addProject for user ${userName}`, {
			status: 404,
		});

	try {
		let createProjectsAndOrg = null;

		// If repo(s) is under an organization (not personal), create projects with corresponding organization
		if (type === "Organization" && user.addProject[0]?.teamId)
			createProjectsAndOrg = prisma.organization.upsert({
				where: { githubOrganizationId: githubOrgId.toString() },
				create: {
					githubOrganizationId: githubOrgId.toString(),
					slug: githubOrgSlug,
					name: githubOrgSlug,
					image: githubOrgImage,
					projects: {
						createMany: {
							data: addedRepos.map((repo: Repository) => ({
								githubProjectId: repo.id.toString(),
								slug: repo.name,
								name: repo.name,
								private: repo.private,
								createdBy: user.id,
								teamId: user.addProject[0]?.teamId as string,
							})),
							skipDuplicates: true,
						},
					},
				},
				update: {
					slug: githubOrgSlug,
					name: githubOrgSlug,
					image: githubOrgImage,
					projects: {
						createMany: {
							data: addedRepos.map((repo: Repository) => ({
								githubProjectId: repo.id.toString(),
								slug: repo.name,
								name: repo.name,
								private: repo.private,
								createdBy: user.id,
								teamId: user.addProject[0]?.teamId as string,
							})),
							skipDuplicates: true,
						},
					},
				},
			});
		// If repo(s) is for an individual user, just create the projects directly without an organization
		else if (type === "User" && user.addProject[0]?.teamId)
			createProjectsAndOrg = prisma.project.createMany({
				data: addedRepos.map((repo: Repository) => ({
					githubProjectId: repo.id.toString(),
					slug: repo.name,
					name: repo.name,
					private: repo.private,
					createdBy: user.id,
					teamId: user.addProject[0]?.teamId as string,
				})),
				skipDuplicates: true,
			});

		// Delete existing repos
		const deleteProjects = prisma.project.deleteMany({
			where: {
				githubProjectId: {
					in: removedRepos.map((repo: Repository) => repo.id.toString()),
				},
			},
		});

		if (!createProjectsAndOrg) throw "bad transaction";
		// Sync repos to database in a single transaction
		await prisma.$transaction([createProjectsAndOrg, deleteProjects]);
	} catch (err) {
		console.warn("Something went wrong while adding projects:");
		console.error(err);
		return new Response(`Unexpected error: ${JSON.stringify(err)}`, {
			status: 500,
		});
	}

	// Clone, vectorize, and save public code to database
	// TODO: Weviate should be per project, not per user
	const vectorDB = new Weaviate(user.id);
	for (const repo of addedRepos) {
		const installationId = await getInstallationId(repo.full_name);
		const installationToken = await getInstallationToken(installationId);
		const branch = await getMainBranch(repo.full_name, installationToken);
		await vectorDB.embedRepo(repo.full_name, branch);
	}

	return new Response(`Successfully updated repos for ${userName}`);
}
