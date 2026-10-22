'use server'
import { z } from 'zod'
import prisma from '~/prisma'
import { getCurrentUser } from '~/utils/session'

const schema = z.object({
	projectId: z.string(),
	content: z.string()
})

export default async function createInstruction(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	_prevState: any,
	formData: FormData
) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const parsed = schema.parse({
		projectId: formData.get('projectId'),
		content: formData.get('content')
	})

	try {
		const instruction = await prisma.instruction.create({
			data: {
				project: {
					connect: {
						id: parsed.projectId,
						team: { memberships: { some: { userId: user.id } } }
					}
				},
				content: parsed.content,
				creatorUsername: user.userName,
				user: { connect: { id: user.id } }
			}
		})

		if (instruction)
			return {
				message: 'Instruction created',
				type: 'success'
			}
	} catch (err) {
		if (err instanceof Error)
			return {
				message: err.message,
				type: 'error'
			}
		return {
			message: `Unexpected error: ${JSON.stringify(err)}`,
			type: 'error'
		}
	}
	return
}
