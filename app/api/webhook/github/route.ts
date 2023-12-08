import {App} from '@octokit/app'
import {maige} from '~/agents/maige'
import {GITHUB} from '~/constants'
import prisma from '~/prisma'
import {stripe} from '~/stripe'
import {Label, Repository} from '~/types'
import {validateSignature} from '~/utils'
import Weaviate from '~/utils/embeddings/db'
import {getMainBranch, getRepoMeta, openUsageIssue} from '~/utils/github'
import {incrementUsage} from '~/utils/payment'

export const maxDuration = 90

/**
 * POST /api/webhook
 *
 * GitHub webhook handler
 */
export const POST = async (req: Request) => {
	// Verify webhook signature
	const text = await req.text()
	const signature = req.headers.get('x-hub-signature-256') || ''

	const validSignature = await validateSignature(text, signature)
	if (!validSignature) {
		console.error('Bad GitHub webhook secret.')
		return new Response('Bad GitHub webhook secret.', {status: 403})
	}

	const payload = JSON.parse(text)
	const {action} = payload

	/**
	 * Installation-related events. Sync repos/user to database.
	 */
	if (payload?.installation?.account?.login) {
		const {
			installation: {
				account: {login}
			}
		} = payload

		if (action === 'created') {
			// Installed GitHub App

			const {repositories} = payload

			const customer = await prisma.customer.create({
				data: {
					name: login,
					projects: {
						create: repositories.map((repo: Repository) => ({
							name: repo.name
						}))
					}
				}
			})

			// Clone, vectorize, and save public code to database
			const vectorDB = new Weaviate(customer.id)

			for (const repo of repositories) {
				const repoUrl = `${GITHUB.BASE_URL}/${repo.full_name}`
				const branch = await getMainBranch(repo.full_name)

				await vectorDB.embedRepo(repoUrl, branch)
			}

			return new Response(`Added customer ${login}`)
		} else if (action === 'deleted') {
			// Uninstalled GitHub App

			try {
				await prisma.customer.delete({
					where: {
						name: login
					}
				})
			} catch (error) {
				console.warn(error)
			}

			return new Response(`Deleted customer ${login}`)
		} else if (['added', 'removed'].includes(action)) {
			// Added or removed repos from GitHub App

			const {repositories_added: addedRepos, repositories_removed: removedRepos} =
				payload

			const customer = await prisma.customer.upsert({
				where: {
					name: login
				},
				create: {
					name: login
				},
				update: {},
				select: {
					id: true,
					projects: {
						select: {
							name: true
						}
					}
				}
			})

			if (!customer?.id)
				return new Response(`Could not find or create customer ${login}`, {
					status: 500
				})

			const newRepos = addedRepos.filter((repo: Repository) => {
				return !customer.projects.some(
					(project: {name: string}) => project.name === repo.name
				)
			})

			// Clone, vectorize, and save public code to database
			const vectorDB = new Weaviate(customer.id)

			for (const repo of addedRepos) {
				const repoUrl = `${GITHUB.BASE_URL}/${repo.full_name}`
				const branch = await getMainBranch(repo.full_name)

				await vectorDB.embedRepo(repoUrl, branch)
			}

			const createProjects = prisma.project.createMany({
				data: newRepos.map((repo: Repository) => ({
					name: repo.name,
					customerId: customer.id
				})),
				skipDuplicates: true
			})

			const deleteProjects = prisma.project.deleteMany({
				where: {
					customerId: customer.id,
					name: {
						in: removedRepos.map((repo: Repository) => repo.name)
					}
				}
			})

			// Sync repos to database in a single transaction
			await prisma.$transaction([createProjects, deleteProjects])

			return new Response(`Successfully updated repos for ${login}`)
		}
	}

	/**
	 * Issue-related events. We care about new issues and comments.
	 */
	const {
		comment,
		issue,
		sender: {login: sender},
		installation: {id: instanceId}
	} = payload

	if (sender.includes('maige'))
		return new Response('Comment by Maige', {status: 202})

	if (comment && !comment.body.toLowerCase().includes('maige'))
		return new Response('Irrelevant comment', {status: 202})

	if (
		!(
			(action === 'opened' && payload?.issue) ||
			(action === 'created' && payload?.comment) ||
			(action === 'opened' && payload?.pull_request) ||
			(action === 'synchronize' && payload?.pull_request)
		)
	)
		return new Response('Webhook received', {status: 202})

	const {
		repository: {
			node_id: repoId,
			name,
			owner: {login: owner}
		}
	} = payload

	const customer = await prisma.customer.findUnique({
		where: {
			name: owner || undefined
		},
		select: {
			id: true,
			usage: true,
			usageLimit: true,
			usageWarned: true,
			projects: {
				where: {
					name: payload?.repository?.name
				},
				select: {
					name: true,
					customInstructions: true
				}
			}
		}
	})

	if (!customer) return new Response('Could not find customer', {status: 500})

	const {id: customerId, usage, usageLimit, usageWarned, projects} = customer
	const instructions = projects?.[0]?.customInstructions || ''

	// Get GitHub app instance access token
	const app = new App({
		appId: process.env.GITHUB_APP_ID || '',
		privateKey: process.env.GITHUB_PRIVATE_KEY || ''
	})

	const octokit = await app.getInstallationOctokit(instanceId)

	/**
	 * Usage limit-gating:
	 * Warn user twice with grace period, then discontinue usage.
	 */
	if (usage > usageLimit) {
		if (!usageWarned || usage == usageLimit + 10)
			try {
				await openUsageIssue(stripe, octokit, customerId, repoId)
				await prisma.customer.update({
					where: {
						id: customerId
					},
					data: {
						usageWarned: true
					}
				})
				console.log('Usage issue opened for: ', owner, name)
			} catch (error) {
				console.warn('Could not open usage issue for: ', owner, name)
				console.error(error)
				return new Response('Could not open usage issue', {status: 500})
			}

		// Only block usage after grace period
		if (usage > usageLimit + 10) {
			console.warn('Usage limit exceeded for: ', owner, name)
			return new Response('Please add payment info to continue.', {
				status: 402
			})
		}
	}

	await incrementUsage(prisma, owner)

	const {
		issue: {
			node_id: issueId,
			title,
			number: issueNumber,
			body,
			labels: existingLabels
		}
	} = payload

	const existingLabelNames = existingLabels?.map((l: Label) => l.name)

	/**
	 * Repo commands
	 */
	try {
		const {labels: allLabels, description: repoDescription} = await getRepoMeta({
			octokit,
			owner,
			name
		})

		const isComment = action === 'created'

		const engPrompt = `
Hey, here's an incoming ${isComment ? 'comment' : 'issue'}${
			isComment ? ` by @${comment.user.login}: ${comment?.body}.` : ''
		}.
First, some context:
Repo description: ${repoDescription}.
All repo labels: ${allLabels
			.map(
				({name, description}) => `${name}: ${description?.replaceAll(';', ',')}`
			)
			.join('; ')}.
Issue number: ${issueNumber}.
Issue title: ${title}.
Issue body: ${body}.
Issue labels: ${existingLabelNames.join(', ')}.
Your instructions: ${instructions}.
`.replaceAll('\n', ' ')

		await maige({
			input: engPrompt,
			octokit,
			prisma,
			customerId,
			repoFullName: `${owner}/${name}`,
			issueNumber,
			issueId,
			pullUrl: issue?.pull_request?.url || payload?.pull_request?.url || null,
			allLabels
		})

		return new Response('ok', {status: 200})
	} catch (error) {
		console.error(error)
		return new Response(`Something went wrong: ${error}`, {status: 500})
	}
}
