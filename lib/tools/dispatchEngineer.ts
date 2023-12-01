import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import engineer from '~/agents/engineer'
/**
 * Execute a shell command
 */
export default function dispatchEngineer({
	octokit,
	prisma,
	customerId,
	repoName
}: {
	octokit: any
	prisma: any
	customerId: string
	repoName: string
}) {
	return new DynamicStructuredTool({
		description: 'Dispatch an engineer to work on an issue',
		func: async ({input}) => {
			console.log('DISPATCHING ENGINEER')
			engineer({
				input,
				octokit,
				prisma,
				customerId,
				repoName
			})
			// await new Promise(resolve => setTimeout(resolve, 1000))
			return 'dispatched'
		},
		name: 'dispatchEngineer',
		schema: z.object({
			input: z
				.string()
				.describe('specific, detailed instructions for the engineer.')
		})
	})
}
