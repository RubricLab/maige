import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import desyncedAgentCall from '~/utils/desyncedAgentCall'

/**
 * Dispatch an engineer agent
 */
export default function dispatchEngineer({
	issueId,
	repoFullName,
	runId,
	issueNumber,
	defaultBranch,
	customerId,
	projectId,
	teamSlug
}: {
	issueId: string
	repoFullName: string
	runId: string
	issueNumber: number
	defaultBranch: string
	customerId?: string
	projectId: string
	teamSlug: string
}) {
	return new DynamicStructuredTool({
		description:
			'Dispatch an engineer to work on an issue. Default to this when asked to solve an issue.',
		func: async ({task, title}) => {
			return await desyncedAgentCall({
				route: 'api/agent/engineer',
				body: {
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
