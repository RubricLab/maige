import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import {reviewer} from '~/agents/reviewer'

/**
 * Dispatch a reviewer agent
 */
export default function dispatchReviewer({
	repoFullName,
	pullUrl,
	customerId,
	projectId,
	octokit,
	runId
}: {
	repoFullName: string
	pullUrl: string
	customerId: string
	projectId: string
	octokit: any
	runId: string
}) {
	return new DynamicStructuredTool({
		description: 'Dispatch a developer to review code.',
		func: async ({task}) => {
			console.log(`Dispatching reviewer for ${repoFullName}`)

			const prRes = (await fetch(pullUrl)) as Response
			if (!prRes.ok) return 'Could not fetch PR'

			const {
				head: {sha: commitId},
				number: pullNumber,
				node_id: pullId,
				diff_url: diffUrl
			} = (await prRes.json()) as any

			const diffRes = (await fetch(diffUrl)) as Response
			if (!diffRes.ok) return 'Could not fetch diff'

			const diff = await diffRes.text()

			return await reviewer({
				task,
				diff,
				pullNumber,
				pullId,
				commitId,
				repoFullName,
				customerId,
				projectId,
				octokit,
				runId
			})
		},
		name: 'dispatchReviewer',
		schema: z.object({
			task: z
				.string()
				.describe(
					"Specific, detailed instructions for the reviewer. Don't include the repo name, issue number, etc. Only a very direct instruction."
				)
		})
	})
}
