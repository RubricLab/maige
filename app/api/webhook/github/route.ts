import { Webhooks } from '@octokit/webhooks'
import { headers } from 'next/headers'
import env from '~/env'
import {
	handleAppInstall,
	handleAppUnInstall,
	handleAppUpdates,
	handleIssues,
	handlePullRequests,
	handlePush
} from '~/utils/github/handle/'

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
	await webhook
		.verifyAndReceive({
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			id: hdrs.get('x-github-delivery')!,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			name: hdrs.get('x-github-event') as any,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			signature: hdrs.get('x-hub-signature')!,
			payload: await req.text()
		})
		.catch(err => {
			return new Response(`Webhook signature could not be verified: ${JSON.stringify(err)}`, {
				status: 500
			})
		})

	return new Response('Webhook received', { status: 203 })
}

// Handle webhooks
// @ts-ignore
webhook.on('push', handlePush)
// @ts-ignore
webhook.on('installation.created', handleAppInstall)
webhook.on(
	['installation_repositories.added', 'installation_repositories.removed'],
	// @ts-ignore
	handleAppUpdates
)
// @ts-ignore
webhook.on('installation.deleted', handleAppUnInstall)
// @ts-ignore
webhook.on(['issues.opened', 'issue_comment.created'], handleIssues)
// @ts-ignore
webhook.on(['pull_request'], handlePullRequests)
