import {Webhooks} from '@octokit/webhooks'

/**
 * Handle pull requests
 */
export default function handlePullRequests(webhook: Webhooks<unknown>) {
	webhook.on(['pull_request'], async ({payload}) => {
		const {pull_request: pr} = payload

		// TODO: add code to optimize PR reviewing
		if (pr) return new Response('PR received', {status: 202})
	})
}
