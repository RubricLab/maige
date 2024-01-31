'use server'
import {z} from 'zod'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

const schema = z.object({
	teamId: z.string()
})

export default async function createProjectIntent(
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
		teamId: formData.get('teamId')
	})

	try {
		const response = await prisma.addProject.create({
			data: {
				createdBy: user.id,
				teamId: parsed.teamId
			}
		})
		return {
			message: `Successfully created request to add project`,
			type: 'success'
		}
	} catch (err) {
		if (err instanceof Error)
			return {
				message: err.message,
				type: 'error'
			}
		return {
			message: JSON.stringify(err),
			type: 'error'
		}
	}
}
