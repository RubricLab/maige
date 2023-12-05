import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import {addComment} from '~/utils/github'

export default function updateInstructions({
	prisma,
	customerId,
	repoName,
	octokit
}: {
	prisma: any
	octokit: any
	customerId: string
	repoName: string
}) {
	return new DynamicStructuredTool({
		description:
			'User will explicitly ask for custom instructions to be updated.',
		func: async ({newInstructions, issueId}) => {
			const res = await prisma.project.update({
				where: {
					customerId_name: {
						customerId,
						name: repoName.split('/')[1]
					}
				},
				data: {
					customInstructions: newInstructions
				}
			})

			await addComment({
				octokit,
				issueId,
				comment: `Done. Your new instructions:\n\n> ${newInstructions || 'none'}`
			})

			return JSON.stringify(res)
		},
		name: 'updateInstructions',
		schema: z.object({
			newInstructions: z.string().describe('The new instructions.'),
			issueId: z.string().describe('The ID of the issue')
		})
	})
}
