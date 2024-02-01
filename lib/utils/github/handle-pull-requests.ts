import {PullRequestEvent} from '@octokit/webhooks-types'

/**
 * Handle pull requests
 */
export default function handlePullRequests(payload: PullRequestEvent) {
	const {pull_request: pr} = payload
	// TODO: add code to optimize PR reviewing
	if (pr) return new Response('PR received', {status: 202})
}
