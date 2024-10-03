import { DynamicStructuredTool } from '@langchain/core/tools'
import type { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { addComment } from '~/utils/github'

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
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	octokit: any
	issueId: string
	customerId: string
	repoFullName: string
	instructionCreator?: string
	instructionCommentLink?: string
}) {
	return new DynamicStructuredTool({
		description: 'User will explicitly ask for custom instructions to be updated.',
		func: async ({ newInstructions }) => {
			const project = await prisma.project.findFirst({
				where: {
					createdBy: customerId,
					slug: repoFullName.split('/')[1] as string
				}
			})
			const res = await prisma.instruction.create({
				data: {
					createdBy: customerId,
					projectId: project?.id as string,
					content: newInstructions,
					creatorUsername: instructionCreator || null,
					githubCommentLink: instructionCommentLink || null
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
