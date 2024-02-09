'use server'

import {z} from 'zod'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

const schema = z.object({
	teamSlug: z.string()
})

export default async function createProjectIntent(
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
		teamSlug: formData.get('teamSlug')
	})

	try {
		await prisma.addProject.create({
			data: {
				user: {
					connect: {
						id: user.id
					}
				},
				team: {
					connect: {
						slug: parsed.teamSlug
					}
				}
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
