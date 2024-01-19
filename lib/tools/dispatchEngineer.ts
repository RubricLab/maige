import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import {engineer} from '~/agents/engineer'

/**
 * Dispatch an engineer agent
 */
export default function dispatchEngineer({
	repoFullName,
	issueNumber,
	customerId,
	projectId
}: {
	repoFullName: string
	issueNumber: number
	customerId: string
	projectId: string
}) {
	return new DynamicStructuredTool({
		description:
			'Dispatch an engineer to work on an issue. Default to this when asked to solve an issue.',
		func: async ({task}) => {
			console.log(`Dispatching engineer for ${repoFullName}`)

			engineer({
				task,
				repoFullName,
				issueNumber,
				customerId,
				projectId
			})

			return 'dispatched'
		},
		name: 'dispatchEngineer',
		schema: z.object({
			task: z
				.string()
				.describe(
					"Specific, detailed instructions for the engineer. Don't include the repo name, issue number, etc. Only a very direct instruction."
				)
		})
	})
}
