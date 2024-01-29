import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import {Label} from '~/types'
import {labelIssue} from '~/utils/github'

/**
 * Label an issue using GitHub REST API tool
 */
export function labelTool({
	octokit,
	allLabels,
	issueId
}: {
	octokit: any
	allLabels: Label[]
	issueId: string
}) {
	return new DynamicStructuredTool({
		description: 'Adds a label to an issue',
		name: 'labelIssue',
		schema: z.object({
			labelNames: z.array(z.string()).describe('The names of labels to apply')
		}),
		func: async ({labelNames}) => {
			const res = await labelIssue({octokit, labelNames, allLabels, issueId})

			return JSON.stringify(res)
		}
	})
}
