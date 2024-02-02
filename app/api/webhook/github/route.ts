import {Webhooks} from '@octokit/webhooks'
import {headers} from 'next/headers'
import env from '~/env.mjs'
import {
	handleAppInstall,
	handleAppUnInstall,
	handleAppUpdates,
	handleIssues,
	handlePullRequests
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
			id: hdrs.get('x-github-delivery')!,
			name: hdrs.get('x-github-event') as any,
			signature: hdrs.get('x-hub-signature')!,
			payload: await req.text()
		})
		.catch(err => {
			return new Response(
				`Webhook signature could not be verified: ${JSON.stringify(err)}`,
				{
					status: 500
				}
			)
		})

	return new Response()
}

// Handle webhooks
webhook.on('installation.created', async p => await handleAppInstall(p))
webhook.on(
	['installation_repositories.added', 'installation_repositories.removed'],
	async p => await handleAppUpdates(p)
)
webhook.on('installation.deleted', async p => await handleAppUnInstall(p))
webhook.on(
	['issues.opened', 'issue_comment.created'],
	async p => await handleIssues(p)
)
webhook.on(['pull_request'], async p => await handlePullRequests(p))
