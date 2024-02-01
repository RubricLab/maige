import {Webhooks} from '@octokit/webhooks'
import {headers} from 'next/headers'
import env from '~/env.mjs'
import handleAppInstall from '~/utils/github/handle-app-install'
import handleAppUnInstall from '~/utils/github/handle-app-uninstall'
import handleAppUpdates from '~/utils/github/handle-app-updates'
import handleIssues from '~/utils/github/handle-issues'
import handlePullRequests from '~/utils/github/handle-pull-requests'

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
webhook.on(
	'installation.created',
	async ({payload}) => await handleAppInstall(payload)
)
webhook.on(
	['installation_repositories.added', 'installation_repositories.removed'],
	async ({payload}) => await handleAppUpdates(payload)
)
webhook.on('installation.deleted', async ({payload}) => {
	await handleAppUnInstall(payload)
})
webhook.on(['issues.opened', 'issue_comment.created'], async ({payload}) => {
	await handleIssues(payload)
})
webhook.on(['pull_request'], handlePullRequests)
