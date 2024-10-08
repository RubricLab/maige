import { engineer } from '~/agents/engineer'
import env from '~/env'

export const maxDuration = 300

const validateAgentCall = (headers: Headers) => {
	if (!(headers.get('Authorization') === `Bearer ${env.MAIGE_SERVER_SECRET}`))
		throw new Error('Webhook signature could not be verified')
}

export const POST = async (req: Request) => {
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
		title,
		teamSlug
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
		title,
		teamSlug
	})

	return new Response('Engineer Agent Complete', { status: 200 })
}
