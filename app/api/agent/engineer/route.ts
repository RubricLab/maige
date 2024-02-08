import {engineer} from '~/agents/engineer'
import env from '~/env.mjs'

export const maxDuration = 300

const validateAgentCall = (headers: Headers) => {
	if (!(headers.get('Authorization') === `Bearer ${env.NEXTAUTH_SECRET}`))
		throw new Error('Webhook signature could not be verified')
}

export const POST = async (req: Request) => {
	console.log('POST /api/agent/engineer')

	validateAgentCall(req.headers)

	const {
		task,
		runId,
		repoFullName,
		issueNumber,
		defaultBranch,
		customerId,
		projectId,
		issueId,
		title
	} = await req.json()

	await engineer({
		task,
		runId,
		repoFullName,
		issueNumber,
		defaultBranch,
		customerId,
		projectId,
		issueId,
		title
	})

	return new Response('Engineer Agent Complete', {status: 200})
}
