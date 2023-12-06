import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'

/**
 * Comment on code
 */
export function codeComment({
	octokit,
	owner,
	repo,
	pull_number,
	commit_id,
	path,
}: {
	octokit: any
	owner: string
	repo: string
	pull_number: number
	commit_id: string
	path: string
}) {
	return new DynamicStructuredTool({
		description: 'Adds a comment to code in a PR',
		func: async ({comment, line, side}) => {
			const footer = `By [Maige](https://maige.app). How's my driving?`
			const res = await octokit.request(
				'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments',
				{
					owner: owner,
					repo: repo,
					pull_number: pull_number,
					body: comment + '\n\n' + footer,
					commit_id: commit_id,
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
