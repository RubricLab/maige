import {PrismaClient} from '@prisma/client'
import {DynamicStructuredTool} from 'langchain/tools'
import {z} from 'zod'
import {addComment} from '~/utils/github'

export default function updateInstructions({
	prisma,
	customerId,
	repoFullName,
	issueId,
	instructionCreator,
	instructionCommentLink,
	octokit
}: {
	prisma: PrismaClient
	octokit: any
	issueId: string
	customerId: string
	repoFullName: string
	instructionCreator: string
	instructionCommentLink: string
}) {
	return new DynamicStructuredTool({
		description:
			'User will explicitly ask for custom instructions to be updated.',
		func: async ({newInstructions}) => {
			const project = (
				await prisma.project.findMany({
					where: {
						customerId,
						name: repoFullName.split('/')[1]
					}
				})
			)[0]
			const res = await prisma.instruction.create({
				data: {
					projectId: project.id,
					content: newInstructions,
					creatorUsername: instructionCreator,
					githubCommentLink: instructionCommentLink
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
			newInstructions: z.string().describe('The new instructions.')
		})
	})
}
