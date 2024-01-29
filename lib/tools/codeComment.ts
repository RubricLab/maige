import {DynamicStructuredTool} from '@langchain/core/tools'
import {z} from 'zod'
import {COPY} from '~/constants'

/**
 * Comment on code
 */
export function codeComment({
	octokit,
	repoFullName,
	pullNumber,
	commitId
}: {
	octokit: any
	repoFullName: string
	pullNumber: number
	commitId: string
}) {
	return new DynamicStructuredTool({
		description: 'Adds a comment to code in a PR',
		func: async ({comment, line, side, path}) => {
			const res = await octokit.request(
				`POST /repos/${repoFullName}/pulls/${pullNumber}/comments`,
				{
					body: `${comment}\n\n${COPY.FOOTER}`,
					commit_id: commitId,
					path,
					line,
					side,
					headers: {'X-GitHub-Api-Version': '2022-11-28'}
				}
			)

			return res.status === 201 ? 'commented' : 'failed to comment'
		},
		name: 'codeComment',
		schema: z.object({
			comment: z.string().describe('The comment to add'),
			line: z.number().describe('The line number'),
			side: z
				.enum(['LEFT', 'RIGHT'])
				.describe('If Deletion then LEFT, else RIGHT'),
			path: z.string().describe('The path to the file')
		})
	})
}
