import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import desyncedAgentCall from '~/utils/desyncedAgentCall'

/**
 * Dispatch an engineer agent
 */
export default function dispatchEngineer({
	issueId,
	repoFullName,
	issueNumber,
	customerId,
	projectId
}: {
	issueId: string
	repoFullName: string
	issueNumber: number
	customerId: string
	projectId: string
}) {
	return new DynamicStructuredTool({
		description:
			'Dispatch an engineer to work on an issue. Default to this when asked to solve an issue.',
		func: async ({task, title}) => {
			return await desyncedAgentCall({
				route: 'api/agent/engineer',
				body: {
					task,
					repoFullName,
					issueNumber,
					customerId,
					projectId,
					issueId,
					title
				}
			})
		},
		name: 'dispatchEngineer',
		schema: z.object({
			task: z
				.string()
				.describe(
					"Specific, detailed instructions for the engineer. Don't include the repo name, issue number, etc. Only a very direct instruction."
				),
			title: z.string().describe('Concise title for the task. (Used as PR title)')
		})
	})
}
