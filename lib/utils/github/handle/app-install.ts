import {InstallationCreatedEvent} from '@octokit/webhooks-types'
import prisma from '~/prisma'
import {Repository} from '~/types'
import {getInstallationId, getInstallationToken} from '~/utils/github'
import Weaviate from '../../embeddings/db'
import {getMainBranch} from '../../github'

/**
 * App installation
 */
export default async function handleAppInstall({
	payload
}: {
	payload: InstallationCreatedEvent
}) {
	const {
		repositories,
		installation: {
			account: {
				id: githubOrgId,
				login: githubOrgSlug,
				avatar_url: githubOrgImage,
				type
			}
		},
		sender: {id: githubUserId, login: userName}
	} = payload

	// Get user & request to add project
	// TODO: Only use githubUserId eventually & replace with findUnique since userNames are mutable (added as a fallback for users before the migration) (Feb 2, 2024)
	const user = await prisma.user.findFirst({
		where: {OR: [{githubUserId: githubUserId.toString()}, {userName: userName}]},
		select: {
			id: true,
			addProject: {
				take: 1,
				orderBy: {createdAt: 'desc'}
			}
		}
	})

	if (!user?.id)
		return new Response(`Could not find user ${userName}`, {
			status: 500
		})

	try {
		if (type === 'Organization')
			// Create projects with matching organization
			await prisma.organization.upsert({
				where: {githubOrganizationId: githubOrgId.toString()},
				create: {
					githubOrganizationId: githubOrgId.toString(),
					slug: githubOrgSlug,
					name: githubOrgSlug,
					image: githubOrgImage,
					projects: {
						createMany: {
							data: repositories.map((repo: Repository) => ({
								githubProjectId: repo.id.toString(),
								slug: repo.name,
								name: repo.name,
								private: repo.private,
								createdBy: user.id,
								teamId: user.addProject[0].teamId
							})),
							skipDuplicates: true
						}
					}
				},
				update: {
					slug: githubOrgSlug,
					name: githubOrgSlug,
					image: githubOrgImage,
					projects: {
						createMany: {
							data: repositories.map((repo: Repository) => ({
								githubProjectId: repo.id.toString(),
								slug: repo.name,
								name: repo.name,
								private: repo.private,
								createdBy: user.id,
								teamId: user.addProject[0].teamId
							})),
							skipDuplicates: true
						}
					}
				}
			})
		// Create projects under user
		else if (type === 'User')
			await prisma.project.createMany({
				data: repositories.map((repo: Repository) => ({
					githubProjectId: repo.id.toString(),
					slug: repo.name,
					name: repo.name,
					private: repo.private,
					createdBy: user.id,
					teamId: user.addProject[0].teamId
				})),
				skipDuplicates: true
			})
	} catch (err) {
		console.log('error', JSON.stringify(err))
	}

	// Clone, vectorize, and save public code to database
	const vectorDB = new Weaviate(user.id)
	for (const repo of repositories) {
		const installationId = await getInstallationId(repo.full_name)
		const installationToken = await getInstallationToken(installationId)
		const branch = await getMainBranch(repo.full_name, installationToken)
		await vectorDB.embedRepo(repo.full_name, branch)
	}

	return new Response(`Added customer ${userName}`)
}
