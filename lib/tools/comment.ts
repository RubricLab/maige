import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import {COPY} from '~/constants'
import {addComment} from '~/utils/github'

/**
 * Comment on an issue
 */
export default function comment({
	octokit,
	issueId
}: {
	octokit: any
	issueId: string
}) {
	return new DynamicStructuredTool({
		description: 'Adds a comment to an issue',
		func: async ({comment}) => {
			const res = await addComment({
				octokit,
				issueId,
				comment: `${comment}\n\n${COPY.FOOTER}`
			})

			return JSON.stringify(res)
		},
		name: 'addComment',
		schema: z.object({
			comment: z.string().describe('The comment to add')
		})
	})
}
