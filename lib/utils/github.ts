import jwt from 'jsonwebtoken'
import Stripe from 'stripe'
import env from '~/env.mjs'
import prisma from '~/prisma'
import {Label, Repository} from '~/types'
import {createPaymentLink} from '~/utils/payment'
import Weaviate from './embeddings/db'

/**
 * Add comment to issue
 */
export async function addComment({
	octokit,
	issueId,
	comment
}: {
	octokit: any
	issueId: string
	comment: string
}): Promise<string> {
	const commentResult = await octokit.graphql(
		`
			mutation($issueId: ID!, $comment: String!) {
				addComment(input: { subjectId: $issueId, body: $comment }) {
					commentEdge {
						node {
							id
						}
					}
				}
			}
	`,
		{issueId, comment}
	)

	if (!commentResult) throw new Error('Could not add comment')

	return commentResult.addComment.commentEdge.node.id
}

/**
 * Edit comment
 */
export async function editComment({
	octokit,
	commentId,
	comment
}: {
	octokit: any
	commentId: string
	comment: string
}): Promise<string> {
	const commentResult = await octokit.graphql(
		`
			mutation($commentId: ID!, $comment: String!) {
				updateIssueComment(input: { id: $commentId, body: $comment }) {
					issueComment {
						id
					}
				}
			}
	`,
		{commentId, comment}
	)

	if (!commentResult) throw new Error('Could not edit comment')

	return commentResult.updateIssueComment.issueComment.id
}

export const getFormattedDate = () => {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	}).format(new Date())
}

export enum AGENT {
	ENGINEER = 'Engineer'
}

export async function trackAgent({
	octokit,
	issueId,
	agent,
	title,
	teamSlug,
	projectId
}: {
	octokit: any
	issueId: string
	agent: AGENT
	title: string
	teamSlug: string
	projectId: string
}) {
	const commentId = await addComment({
		octokit,
		issueId,
		comment: `**${agent} dispatched.** See details on the [Maige dashboard](${env.NEXTAUTH_URL}).
| **Name** | **Status** | **Message** | **Updated (UTC)** |
|:---------|:-----------|:------------|:------------------|
| **${title}** | 🟡 Pending ([inspect](${env.NEXTAUTH_URL}/${teamSlug}/usage/runs?proj=${projectId})) | | ${getFormattedDate()} |`
	})

	async function updateTracking(status: string) {
		await editComment({
			octokit,
			commentId,
			comment: `**Engineer dispatched.** See details on the [Maige dashboard](${env.NEXTAUTH_URL}).
| **Name** | **Status** | **Message** | **Updated (UTC)** |
|:---------|:-----------|:------------|:------------------|
| **${title}** | ❌ Error ([inspect](${env.NEXTAUTH_URL}/${teamSlug}/usage/runs?proj=${projectId})) | Errored | ${getFormattedDate()} |`
		})
	}

	async function completeTracking(status: string) {
		await editComment({
			octokit,
			commentId,
			comment: `**Engineer dispatched.** See details on the [Maige dashboard](${env.NEXTAUTH_URL}).
| **Name** | **Status** | **Message** | **Updated (UTC)** |
|:---------|:-----------|:------------|:------------------|
| **${title}** | ✅ Complete ([inspect](${env.NEXTAUTH_URL}/${teamSlug}/usage/runs?proj=${projectId})) | PR Created | ${getFormattedDate()} |`
		})
	}

	return {updateTracking, completeTracking}
}

export async function getRepoMeta({
	name,
	owner,
	octokit
}: {
	name: string
	owner: string
	octokit: any
}): Promise<{
	labels: Label[]
	description: string
}> {
	const res = await octokit.graphql(
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
		{name, owner}
	)

	if (!res?.repository) throw new Error('Could not get repo')

	const {description, labels} = res.repository

	if (!labels?.nodes) throw new Error('Could not get labels')

	// TODO: handle missing description by opening new issue
	// if (!description) throw new Error('Could not get description')

	return {
		description,
		labels: labels.nodes
	}
}

/**
 * Label an issue
 */
export async function labelIssue({
	octokit,
	labelNames,
	allLabels,
	issueId
}: {
	octokit: any
	labelNames: string[]
	allLabels: Label[]
	issueId: string
}) {
	const labelIds = allLabels
		.filter(label => labelNames.includes(label.name))
		.map(label => label.id)

	const labelResult = await octokit.graphql(
		`
			mutation AddLabels($issueId: ID!, $labelIds: [ID!]!) {
				addLabelsToLabelable(input: {
					labelIds: $labelIds, labelableId: $issueId
				}) {
					labelable {
						labels(first:10) {
							nodes {
								name
							}
						}
					}
				}
			}
    `,
		{issueId, labelIds}
	)

	if (!labelResult) throw new Error('Could not add labels')

	return labelResult
}

/**
 * Open issue to prompt user to add payment info
 */
export async function openUsageIssue(
	stripe: Stripe,
	octokit: any,
	customerId: string,
	repoId: string
) {
	const paymentLink = await createPaymentLink(stripe, customerId, 'base')
	const warningIssue = await octokit.graphql(
		`
      mutation($repoId: ID!, $title: String!, $body: String!) {
        createIssue(input: { repositoryId: $repoId, title: $title, body: $body }) {
          issue {
            id
          }
        }
      }
		`,
		{
			repoId,
			title: 'Maige Usage',
			body:
				'Thanks for trying [Maige](https://maige.app).\n\n' +
				'Running GPT-based services is pricey. At this point, we ask you to add payment info to continue using Maige.\n\n' +
				`[Add payment info](${paymentLink})\n\n` +
				'Feel free to close this issue.'
		}
	)

	if (!warningIssue) {
		console.warn('Failed to open usage issue')
		throw new Error('Failed to open usage issue.')
	}
}

/**
 * Get main branch of a repo
 */
export const getMainBranch = async (
	repoFullName: string,
	accessToken?: string
) => {
	const repoRes = (await fetch(`https://api.github.com/repos/${repoFullName}`, {
		method: 'GET',
		headers: {
			Authorization: accessToken && `token ${accessToken}`
		}
	})) as Response
	const repo = (await repoRes.json()) as any
	const branchName = repo.default_branch

	return branchName
}

/**
 * Get JWT for app
 */
export const getAppJwt = async () => {
	const now = Math.floor(Date.now() / 1000)
	const payload = {
		iat: now,
		exp: now + 60,
		iss: process.env.GITHUB_APP_ID
	}

	const token = jwt.sign(payload, process.env.GITHUB_PRIVATE_KEY, {
		algorithm: 'RS256'
	})

	return token
}

/**
 * Get installation ID from repo
 */
export const getInstallationId = async (repoFullName: string) => {
	const token = await getAppJwt()

	const res = (await fetch(
		`https://api.github.com/repos/${repoFullName}/installation`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/vnd.github.v3+json',
				Authorization: `Bearer ${token}`
			}
		}
	)) as Response

	const json = await res.json()

	return json.id
}

/**
 * Get installation token from repo
 */

export const getInstallationToken = async (installationId: string) => {
	const token = await getAppJwt()

	const res = (await fetch(
		`https://api.github.com/app/installations/${installationId}/access_tokens`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/vnd.github.v3+json',
				Authorization: `Bearer ${token}`
			}
		}
	)) as Response

	const json = await res.json()

	return json.token
}

/**
 * Webhook handler for when a user adds Maige
 */
export async function handleInstall({
	action,
	payload,
	userName
}: {
	action: string
	payload: any
	userName: string
}) {
	newUser: try {
		if (action !== 'created') break newUser

		// Repository data
		const {repositories} = payload

		// Get user & request to add project
		const user = await prisma.user.findUnique({
			where: {userName: userName},
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

		// Create projects
		const projects = await prisma.project.createMany({
			data: repositories.map((repo: Repository) => ({
				name: repo.name,
				slug: repo.name,
				createdBy: user.id,
				teamId: user.addProject[0].teamId ?? ''
			})),
			skipDuplicates: true
		})

		// Clone, vectorize, and save public code to database
		const vectorDB = new Weaviate(user.id)
		for (const repo of repositories) {
			const installationId = await getInstallationId(repo.full_name)
			const installationToken = await getInstallationToken(installationId)
			const branch = await getMainBranch(repo.full_name, installationToken)
			await vectorDB.embedRepo(repo.full_name, branch)
		}

		return new Response(`Added customer ${userName}`)
	} catch (error) {
		console.error(error)
		return new Response(`Unexpected error: ${JSON.stringify(error)}`, {
			status: 500
		})
	}
}

/**
 * Webhook handler for when a user uninstalls
 */
export async function handleUnInstall({
	action,

	userName
}: {
	action: string
	userName: string
}) {
	deleteUser: try {
		if (action !== 'deleted') break deleteUser
		await prisma.user.delete({
			where: {
				userName: userName
			}
		})
		return new Response(`Deleted customer ${userName}`)
	} catch (error) {
		console.error(error)
		return new Response(`Unexpected error: ${JSON.stringify(error)}`, {
			status: 500
		})
	}
}

/**
 * Webhook handler for when a project is added or removed
 */
export async function handleAddOrDeleteProjects({
	action,
	payload,
	userName
}: {
	action: string
	payload: any
	userName: string
}) {
	updateProjects: try {
		if (!['added', 'removed'].includes(action)) break updateProjects

		// Added or removed repos from GitHub App
		const {repositories_added: addedRepos, repositories_removed: removedRepos} =
			payload

		const user = await prisma.user.findUnique({
			where: {
				userName: userName
			},
			select: {
				id: true,
				projects: {
					select: {
						name: true
					}
				},
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

		const newRepos = addedRepos.filter((repo: Repository) => {
			return !user.projects.some(
				(project: {name: string}) => project.name === repo.name
			)
		})

		// Clone, vectorize, and save public code to database
		const vectorDB = new Weaviate(user.id)

		const createProjects = prisma.project.createMany({
			data: newRepos.map((repo: Repository) => ({
				name: repo.name,
				slug: repo.name,
				createdBy: user.id,
				teamId: user.addProject[0].teamId ?? ''
			})),
			skipDuplicates: true
		})

		const deleteProjects = prisma.project.deleteMany({
			where: {
				createdBy: user.id,
				slug: {
					in: removedRepos.map((repo: Repository) => repo.name)
				}
			}
		})

		// Sync repos to database in a single transaction
		await prisma.$transaction([createProjects, deleteProjects])
		for (const repo of addedRepos) {
			const installationId = await getInstallationId(repo.full_name)
			const installationToken = await getInstallationToken(installationId)
			const branch = await getMainBranch(repo.full_name, installationToken)
			await vectorDB.embedRepo(repo.full_name, branch)
		}

		return new Response(`Successfully updated repos for ${userName}`)
	} catch (error) {
		console.error(error)
		return new Response(`Unexpected error: ${JSON.stringify(error)}`, {
			status: 500
		})
	}
}

/**
 * Handle all installation-related events. Sync repos/user to database.
 */
export async function handleInstallationEvents({payload}: {payload: any}) {
	const {action} = payload
	if (payload?.installation?.account?.login) {
		const {
			installation: {
				account: {login}
			}
		} = payload

		// Handlers for each use case
		await handleInstall({
			action: action,
			payload: payload,
			userName: login
		})
		await handleUnInstall({action: action, userName: login})
		await handleAddOrDeleteProjects({
			action: action,
			payload: payload,
			userName: login
		})
	}
}
