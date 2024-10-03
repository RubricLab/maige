import type { InstallationDeletedEvent } from "@octokit/webhooks-types";
import prisma from "~/prisma";
import type { Repository } from "~/types";

/**
 * App un-installation
 */
export default async function handleAppUnInstall({
	payload,
}: {
	payload: InstallationDeletedEvent;
}) {
	const {
		repositories,
		installation: {
			account: { id: githubOrgId, type },
		},
	} = payload;

	// If org, delete organization, projects will get deleted by cascading
	if (type === "Organization")
		await prisma.organization.delete({
			where: { githubOrganizationId: githubOrgId.toString() },
		});

	// If user, delete all user projects
	if (type === "User" && !!repositories?.length)
		await prisma.project.deleteMany({
			where: {
				githubProjectId: {
					in: repositories?.map((repo: Repository) => repo.id.toString()),
				},
			},
		});
}
