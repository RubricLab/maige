import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import {COPY} from '~/constants'
import {addComment} from '~/utils/github'

/**
 * Comment on an issue
 */
export function prComment({octokit, pullId}: {octokit: any; pullId: string}) {
	return new DynamicStructuredTool({
		description: 'Adds a comment to a PR',
		func: async ({comment}) => {
			const res = await addComment({
				octokit,
				issueId: pullId,
				comment: `${comment}\n\n${COPY.FOOTER}`
			})

			return JSON.stringify(res)
		},
		name: 'prComment',
		schema: z.object({
			comment: z.string().describe('The comment to add')
		})
	})
}
