import {engineer} from '~/agents/engineer'
import {EngineerInput} from '~/types/agent'

export const maxDuration = 300

export const POST = async (req: Request) => {
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
	}: EngineerInput = await req.json()

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

	return new Response('Engineer Agent Complete', {status: 200})
}
