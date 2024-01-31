import {Webhooks} from '@octokit/webhooks'
import {GITHUB} from '~/constants'
import {Repository} from '~/types'
import Weaviate from '../embeddings/db'
import {getMainBranch} from '../github'

/**
 * Handles if a repository(s) is added or removed for an existing installation
 */
export default function handleUpdates(webhook: Webhooks<unknown>) {
	webhook.on(
		['installation_repositories.added', 'installation_repositories.removed'],
		async ({payload}) => {
			// Added or removed repos
			const {
				repositories_added: addedRepos,
				repositories_removed: removedRepos,
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

			// Get user
			const user = await prisma.user.findUnique({
				where: {
					githubUserId: githubUserId.toString()
				},
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
				let createProjectsAndOrg = null

				// If repo(s) is under an organization (not personal), create projects with corresponding organization
				if (type === 'Organization')
					createProjectsAndOrg = prisma.organization.upsert({
						where: {githubOrganizationId: githubOrgId.toString()},
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
									data: addedRepos.map((repo: Repository) => ({
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
				// If repo(s) is for an individual user, just create the projects directly without an organization
				else if (type === 'User')
					createProjectsAndOrg = prisma.project.createMany({
						data: addedRepos.map((repo: Repository) => ({
							githubProjectId: repo.id.toString(),
							slug: repo.name,
							name: repo.name,
							private: repo.private,
							createdBy: user.id,
							teamId: user.addProject[0].teamId
						})),
						skipDuplicates: true
					})

				// Delete existing repos
				const deleteProjects = prisma.project.deleteMany({
					where: {
						githubProjectId: {
							in: removedRepos.map((repo: Repository) => repo.id.toString())
						}
					}
				})

				// Sync repos to database in a single transaction
				await prisma.$transaction([createProjectsAndOrg, deleteProjects])
			} catch (err) {
				console.log('error', JSON.stringify(err))
				return new Response(`Unexpected error: ${JSON.stringify(err)}`, {
					status: 500
				})
			}

			// Clone, vectorize, and save public code to database
			// TODO: Weviate should be per project, not per user
			const vectorDB = new Weaviate(user.id)
			for (const repo of addedRepos) {
				const repoUrl = `${GITHUB.BASE_URL}/${repo.full_name}`
				const branch = await getMainBranch(repo.full_name)
				await vectorDB.embedRepo(repoUrl, branch)
			}

			return new Response(`Successfully updated repos for ${userName}`)
		}
	)
}
