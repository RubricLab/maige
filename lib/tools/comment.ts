import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import {addComment} from '~/utils/github'

/**
 * Comment on an issue
 */
export default function comment({octokit}: {octokit: any}) {
	return new DynamicStructuredTool({
		description: 'Adds a comment to an issue',
		func: async ({issueId, comment}) => {
			const footer = `By [Maige](https://maige.app). How's my driving?`
			const res = await addComment({
				octokit,
				issueId,
				comment: `${comment}\n\n${footer}`
			})

			return JSON.stringify(res)
		},
		name: 'addComment',
		schema: z.object({
			issueId: z.string().describe('The ID of the issue'),
			comment: z.string().describe('The comment to add')
		})
	})
}
