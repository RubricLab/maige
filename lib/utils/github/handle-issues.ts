import {App} from '@octokit/app'
import {Webhooks} from '@octokit/webhooks'
import {maige} from '~/agents/maige'
import env from '~/env.mjs'
import {getRepoMeta} from '../github'
import {incrementUsage} from '../payment'
import {getPromptForIssue} from '../prompt'

/**
 * Handle when a new issue is created
 */
export default function handleIssues(webhook: Webhooks<unknown>) {
	webhook.on('issues.opened', async ({payload}) => {
		const {
			sender: {login: senderGithubUserName, id: senderGithubId},
			installation: {id: instanceId},
			repository,
			issue
		} = payload

		// Get project
		const project = await prisma.project.findUnique({
			where: {githubProjectId: repository.id.toString()},
			select: {
				id: true,
				instructions: true
			}
		})

		// Get GitHub app instance access token
		const app = new App({
			appId: env.GITHUB_APP_ID || '',
			privateKey: env.GITHUB_PRIVATE_KEY || ''
		})
		const octokit = await app.getInstallationOctokit(instanceId)

		// Get repo metadata
		const {labels: allLabels, description: repoDescription} = await getRepoMeta({
			name: repository.name,
			owner: repository.owner.login,
			octokit
		})

		// Construct prompt
		const prompt = getPromptForIssue({
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
				// @ts-ignore
				id: issue.id,
				// @ts-ignore
				title: issue.title,
				// @ts-ignore
				body: issue.body,
				// @ts-ignore
				number: issue.number
			}
		})

		// Increase usage per project
		await incrementUsage(repository.id)

		// Check if user exists
		// TODO: ideally we want to use senderGithubId since userName can change but id stays the same
		const user = await prisma.user.findUnique({
			where: {userName: senderGithubUserName},
			select: {id: true}
		})

		// If user exists, check if user has access to project
		const membership = user
			? await prisma.project.findFirst({
					where: {
						githubProjectId: repository.id.toString(),
						team: {memberships: {some: {userId: user.id}}}
					},
					include: {
						team: {include: {memberships: true}}
					}
				})
			: null

		await maige({
			input: prompt,
			octokit,
			customerId: membership ? user.id : null,
			projectId: project.id,
			repoFullName: repository.full_name,
			// @ts-ignore
			issueNumber: issue?.number,
			// @ts-ignore
			issueId: issue?.node_id,
			// @ts-ignore
			pullUrl: issue?.pull_request?.url || null,
			allLabels,
			comment: null,
			beta: true
		})
	})
}
