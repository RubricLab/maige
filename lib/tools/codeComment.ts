import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import {COPY} from '~/constants'

/**
 * Comment on code
 */
export function codeComment({
	octokit,
	repoFullName,
	pullNumber,
	commitId,
	path
}: {
	octokit: any
	repoFullName: string
	pullNumber: number
	commitId: string
	path: string
}) {
	return new DynamicStructuredTool({
		description: 'Adds a comment to code in a PR',
		func: async ({comment, line, side}) => {
			const res = await octokit.request(
				`POST /repos/${repoFullName}/pulls/${pullNumber}/comments`,
				{
					body: `${comment}\n\n${COPY.FOOTER}`,
					commit_id: commitId,
					path: path,
					line: line,
					side: side,
					headers: {
						'X-GitHub-Api-Version': '2022-11-28'
					}
				}
			)
			return JSON.stringify(res)
		},
		name: 'codeComment',
		schema: z.object({
			comment: z.string().describe('The comment to add'),
			line: z.number().describe('The line number'),
			side: z.enum(['LEFT', 'RIGHT']).describe('If Deletion then LEFT, else RIGHT')
		})
	})
}
