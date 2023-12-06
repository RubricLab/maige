import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import {Label} from '~/types'
import {labelIssue} from '~/utils/github'

/**
 * Label an issue using GitHub REST API tool
 */
export function labelTool({
	octokit,
	allLabels
}: {
	octokit: any
	allLabels: Label[]
}) {
	return new DynamicStructuredTool({
		description: 'Adds a label to an issue',
		name: 'labelIssue',
		schema: z.object({
			issueId: z.string().describe('The ID of the issue'),
			labelNames: z.array(z.string()).describe('The names of labels to apply')
		}),
		func: async ({issueId, labelNames}) => {
			const res = await labelIssue({octokit, labelNames, allLabels, issueId})

			return JSON.stringify(res)
		}
	})
}
