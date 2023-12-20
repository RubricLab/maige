import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import {COPY} from '~/constants'
import {logRun} from '~/utils/analytics'
import {addComment} from '~/utils/github'

/**
 * Comment on an issue
 */
export default function comment({
	octokit,
	issueId,
	customerId,
	repoFullName
}: {
	octokit: any
	issueId: string
	customerId: string
	repoFullName: string
}) {
	return new DynamicStructuredTool({
		description: 'Adds a comment to an issue',
		func: async ({comment}) => {
			const [res, _] = await Promise.all([
				addComment({
					octokit,
					issueId,
					comment: `${comment}\n\n${COPY.FOOTER}`
				}),
				logRun({
					repoFullName,
					customerId,
					output: comment
				})
			])

			return JSON.stringify(res)
		},
		name: 'addComment',
		schema: z.object({
			comment: z.string().describe('The comment to add')
		})
	})
}
