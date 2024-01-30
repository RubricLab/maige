'use server'

import {z} from 'zod'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

const schema = z.object({
	projectId: z.string(),
	content: z.string()
})

export default async function createInstruction(
	_prevState: any, // required by useFormState
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
				projectId: parsed.projectId,
				content: parsed.content,
				creatorUsername: 'dashboard',
				createdBy: user.id
			}
		})

		if (instruction)
			return {
				message: `Instruction created`,
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
