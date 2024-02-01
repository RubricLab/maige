import {Webhooks} from '@octokit/webhooks'
import {headers} from 'next/headers'
import env from '~/env.mjs'
import handleInstall from '~/utils/github/handle-install'
import handleIssues from '~/utils/github/handle-issues'
import handleUnInstall from '~/utils/github/handle-uninstall'
import handleUpdates from '~/utils/github/handle-updates'

export const maxDuration = 300

const webhook = new Webhooks({
	secret: env.GITHUB_WEBHOOK_SECRET
})

/**
 * POST /api/webhook
 *
 * GitHub webhook handler
 */
export const POST = async (req: Request) => {
	const hdrs = headers()

	// Verify webhook signature
	await webhook.verifyAndReceive({
		id: hdrs.get('x-github-delivery')!,
		name: hdrs.get('x-github-event') as any,
		signature: hdrs.get('x-hub-signature')!,
		payload: await req.text()
	})

	return new Response()
}

handleInstall(webhook)
handleUpdates(webhook)
handleUnInstall(webhook)
handleIssues(webhook)

/**
 * Comments on issues. We care about new comments.
 */
webhook.on(['issue_comment'], ({payload}) => {
	const {
		comment,
		sender: {login: sender},
		installation: {id: instanceId}
	} = payload

	if (sender.includes('maige'))
		return new Response('Comment by Maige', {status: 202})

	if (comment && !comment.body.toLowerCase().includes('maige'))
		return new Response('Irrelevant comment', {status: 202})
})

/**
 * Pull request related events.
 */
webhook.on('pull_request', ({payload}) => {
	const {pull_request: pr} = payload
	// TODO: remove this once we optimize PR reviewing
	if (pr) return new Response('PR received', {status: 202})
})
