import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import {engineer} from '~/agents/engineer'
import {AGENT, trackAgent} from '~/utils/github'

/**
 * Dispatch an engineer agent
 */
export default function dispatchEngineer({
	octokit,
	issueId,
	repoFullName,
	issueNumber,
	customerId,
	projectId
}: {
	octokit: any
	issueId: string
	repoFullName: string
	issueNumber: number
	customerId: string
	projectId: string
}) {
	console.log('!!! dispatchEngineer !!!')
	return new DynamicStructuredTool({
		description:
			'Dispatch an engineer to work on an issue. Default to this when asked to solve an issue.',
		func: async ({task, title}) => {
			const {
				updateTracking: updateEngineerTracking,
				completeTracking: completeEngineerTracking
			} = await trackAgent({
				octokit,
				issueId,
				agent: AGENT.ENGINEER,
				title
			})

			engineer({
				task,
				repoFullName,
				issueNumber,
				customerId,
				projectId,
				updateEngineerTracking,
				completeEngineerTracking
			})

			return 'dispatched'
		},
		name: 'dispatchEngineer',
		schema: z.object({
			task: z
				.string()
				.describe(
					"Specific, detailed instructions for the engineer. Don't include the repo name, issue number, etc. Only a very direct instruction."
				),
			title: z.string().describe('Simple few-word title for the task')
		})
	})
}
