import { App } from '@octokit/app'
import type { IssueCommentCreatedEvent, IssuesOpenedEvent } from '@octokit/webhooks-types'
import { maige } from '~/agents/maige'
import env from '~/env'
import prisma from '~/prisma'
import type { Comment } from '~/types'
import { getRepoMeta } from '../../github'
import { incrementUsage } from '../../payment'
import { getPrompt } from '../../prompt'

/**
 * Handle when a new issue is created or a comment is created on an existing issue
 */
export default async function handleIssues({
	payload
}: {
	payload: IssueCommentCreatedEvent | IssuesOpenedEvent
}) {
	const {
		sender: { login: senderGithubUserName },
		installation,
		repository,
		issue,
		action
	} = payload

	if (!installation?.id) throw 'no installation'

	const { id: instanceId } = installation

	// Handle comment being created on an issue
	let comment: Comment | null = null
	if (action === 'created') {
		const {
			comment: {
				user: { login: commenterUserName },
				body: commentBody,
				html_url: commentHtmlUrl
			}
		} = payload

		// Comment is made by Maige
		if (senderGithubUserName.includes('maige'))
			return new Response('Comment by Maige', { status: 202 })

		// Comment did not include reference to Maige
		if (!payload.comment.body.toLowerCase().includes('maige'))
			return new Response('Irrelevant comment', { status: 202 })

		comment = {
			name: commenterUserName,
			body: commentBody,
			html_url: commentHtmlUrl
		}
	}

	// Get project
	let project = null
	project = await prisma.project.findUnique({
		where: { githubProjectId: repository.id.toString() },
		select: {
			id: true,
			instructions: true,
			teamId: true
		}
	})

	// Remove later: Handle user requests for existing users (Feb 1st, 2024)
	if (!project) {
		// Not ideal since a name isn't always unique (only unique to organization)
		// But the number of existing projects is small, so there would be low conflicts
		// As an additional check, we also ensure the owner matches
		project = await prisma.project.findFirst({
			where: {
				name: repository.name,
				user: { userName: repository.owner.login }
			},
			select: {
				id: true,
				instructions: true,
				teamId: true
			}
		})
		if (!project) return new Response('Project not found in database', { status: 400 })
	}

	// Get GitHub app instance access token
	const app = new App({
		appId: env.GITHUB_APP_ID || '',
		privateKey: env.GITHUB_PRIVATE_KEY || ''
	})
	const octokit = await app.getInstallationOctokit(instanceId)

	// Get repo metadata
	const { labels: allLabels, description: repoDescription } = await getRepoMeta({
		name: repository.name,
		owner: repository.owner.login,
		octokit
	})

	// Construct prompt
	const prompt = getPrompt({
		repo: {
			id: repository.id,
			description: repoDescription,
			owner: repository.owner.login,
			full_name: repository.full_name,
			name: repository.name,
			node_id: repository.node_id,
			private: repository.private
		},
		instructions: project.instructions,
		labels: allLabels,
		issue: {
			id: issue.id,
			title: issue.title,
			body: issue.body as string,
			number: issue.number
		},
		comment: comment as Comment
	})

	// Increase usage per project
	await incrementUsage(project.id)

	// Check if user exists
	// TODO: ideally we want to use senderGithubId since userName can change but id stays the same
	const user = await prisma.user.findUnique({
		where: { userName: senderGithubUserName },
		select: { id: true }
	})

	// If user exists, check if user has access to project
	const membership = user
		? await prisma.project.findFirst({
				where: {
					githubProjectId: repository.id.toString(),
					team: {
						memberships: {
							some: {
								userId: user.id
							}
						}
					}
				},
				include: {
					team: {
						include: {
							memberships: true
						}
					}
				}
			})
		: null

	const result = await prisma.run.create({
		data: {
			teamId: project.teamId,
			projectId: project.id,
			issueNum: issue?.number,
			issueUrl: issue?.html_url
		}
	})

	try {
		await maige({
			input: prompt,
			runId: result.id,
			octokit,
			customerId: (membership ? user?.id || null : null) as string,
			projectId: project.id,
			defaultBranch: repository.default_branch,
			repoFullName: repository.full_name,
			issueNumber: issue?.number,
			issueId: issue?.node_id,
			pullUrl: (issue?.pull_request?.url || null) as string,
			allLabels,
			comment: comment as Comment,
			beta: true,
			teamSlug: (membership?.team?.slug || null) as string
		})
	} catch (error) {
		console.error(error)
		await prisma.run.update({
			where: {
				id: result.id
			},
			data: {
				status: 'failed',
				finishedAt: new Date()
			}
		})
		return new Response(`Something went wrong: ${error}`, { status: 500 })
	}

	await prisma.run.update({
		where: {
			id: result.id
		},
		data: {
			status: 'completed',
			finishedAt: new Date()
		}
	})
	return
}
