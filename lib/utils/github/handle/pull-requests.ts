import type { PullRequestEvent } from '@octokit/webhooks-types'

/**
 * Handle pull requests
 */
export default async function handlePullRequests({
	payload
}: {
	payload: PullRequestEvent
}) {
	const { pull_request: pr } = payload
	// TODO: add code to optimize PR reviewing
	if (pr) return new Response('PR received', { status: 202 })
	return
}
