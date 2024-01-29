import {App} from '@octokit/app'
import {maige} from '~/agents/maige'
import env from '~/env.mjs'
import {stripe} from '~/stripe'
import {Label} from '~/types'
import {
	getRepoMeta,
	handleInstallationEvents,
	openUsageIssue
} from '~/utils/github'
import {validateSignature} from '~/utils/index'
import {incrementUsage} from '~/utils/payment'

export const maxDuration = 300

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
	await handleInstallationEvents({payload: payload})

	/**
	 * Issue-related events. We care about new issues and comments.
	 */
	const {
		action,
		comment,
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

	const user = await prisma.user.findUnique({
		where: {
			userName: owner || undefined
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
					id: true,
					name: true,
					instructions: true
				}
			}
		}
	})

	if (!user) return new Response('Could not find user', {status: 500})

	const {id: userId, usage, usageLimit, usageWarned, projects} = user
	const instructions =
		projects?.[0]?.instructions.map(ci => ci.content).join('. ') || ''

	const projectId = projects?.[0]?.id

	// Get GitHub app instance access token
	const app = new App({
		appId: env.GITHUB_APP_ID || '',
		privateKey: env.GITHUB_PRIVATE_KEY || ''
	})

	const octokit = await app.getInstallationOctokit(instanceId)

	/**
	 * Usage limit-gating:
	 * Warn user twice with grace period, then discontinue usage.
	 */
	if (usage > usageLimit) {
		if (!usageWarned || usage == usageLimit + 10)
			try {
				await openUsageIssue(stripe, octokit, userId, repoId)
				await prisma.user.update({
					where: {
						id: userId
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

	const {issue, pull_request: pr} = payload
	const prComment = issue?.pull_request

	// TODO: remove this once we optimize PR reviewing
	if (pr) return new Response('PR received', {status: 202})

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
		const beta =
			comment?.body && comment.body.toLowerCase().includes('maige beta')
		const labels = issue?.existingLabels?.map((l: Label) => l.name).join(', ')
		const prompt = `
		Hey, here's an incoming ${isComment ? 'comment' : pr ? 'PR' : 'issue'}.
		First, some context:
		Repo full name: ${owner}/${name}.
		Repo description: ${repoDescription}.
		${
			pr || prComment
				? `
		PR number: ${pr?.number || issue.number}.
		PR title: ${pr?.title || issue.title}.
		PR body: ${pr?.body || issue.body}.
			`
				: `
		Issue number: ${issue.number}.
		Issue title: ${issue.title}.
		Issue body: ${issue.body}.
		Issue labels: ${labels}.
		`
		}
		${isComment ? `The comment by @${comment.user.login}: ${comment?.body}.` : ''}
		Your instructions: ${instructions || 'do nothing'}.
		`.replaceAll('\n', ' ')

		await maige({
			input: prompt,
			octokit,
			customerId: userId,
			projectId,
			repoFullName: `${owner}/${name}`,
			issueNumber: issue?.number,
			issueId: issue?.node_id,
			pullUrl: issue?.pull_request?.url || pr?.url || null,
			allLabels,
			comment,
			beta
		})
		return new Response('ok', {status: 200})
	} catch (error) {
		console.error(error)
		return new Response(`Something went wrong: ${error}`, {status: 500})
	}
}
