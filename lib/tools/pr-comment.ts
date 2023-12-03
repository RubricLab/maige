import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import {addComment} from '~/utils/github'

/**
 * Comment on an issue
 */
export default function pr_comment({octokit, pullId}: {octokit: any, pullId: string}) {
	return new DynamicStructuredTool({
		description: 'Adds a comment to a PR',
		func: async ({comment, severity}) => {
			const footer = `By [Maige](https://maige.app). How's my driving?`
			const res = await addComment({
				octokit,
				issueId: pullId,
				comment: `${comment}\nThis is a Level ${severity} problem.\n\n${footer}`
			})
			return JSON.stringify(res)
		},
		name: 'prComment',
		schema: z.object({
			comment: z.string().describe('The comment to add'),
            severity: z.number().optional().describe('The severity of the needed fix on a scale of 1-5')
		})
	})
}
