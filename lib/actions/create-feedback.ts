'use server'
import {z} from 'zod'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

const schema = z.object({
	content: z.string()
})

export default async function createFeedback(
	prevState: any,
	formData: FormData
) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const parsed = schema.parse({
		content: formData.get('content')
	})

	try {
		const response = await prisma.feedback.create({
			data: {
				content: parsed.content,
				createdBy: user.id
			}
		})
		return {
			message: `Thank you for your feedback`,
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
