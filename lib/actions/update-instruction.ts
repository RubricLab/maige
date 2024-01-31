'use server'

import {z} from 'zod'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

const schema = z.object({
	instructionId: z.string(),
	content: z.string()
})

export async function updateInstruction(prevState: any, formData: FormData) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const parsed = schema.parse({
		instructionId: formData.get('instructionId'),
		content: formData.get('content')
	})

	try {
		await prisma.instruction.update({
			where: {id: parsed.instructionId},
			data: {
				content: parsed.content
			}
		})
		return {
			message: `Instruction updated`,
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
}
