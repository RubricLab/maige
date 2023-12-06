import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import engineer from '~/agents/engineer'

/**
 * Dispatch an engineer agent
 */
export default function dispatchEngineer({
	repo,
	issueNumber,
	customerId
}: {
	repo: string
	issueNumber: number
	customerId: string
}) {
	return new DynamicStructuredTool({
		description: 'Dispatch an engineer to work on an issue',
		func: async ({task}) => {
			console.log(`Dispatching engineer for ${repo}`)

			engineer({
				task,
				repo,
				issueNumber,
				customerId
			})

			return 'dispatched'
		},
		name: 'dispatchEngineer',
		schema: z.object({
			task: z
				.string()
				.describe(
					"specific, detailed instructions for the engineer. Don't include the repo name, issue number, etc. Only a very direct instruction."
				)
		})
	})
}
