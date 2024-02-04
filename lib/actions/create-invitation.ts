'use server'

import {Role} from '@prisma/client'
import {z} from 'zod'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

const schema = z.object({
	email: z.string(),
	role: z.nativeEnum(Role),
	teamId: z.string()
})

// Create invitation to join a team
export default async function createInvitation(
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
		email: formData.get('email'),
		role: formData.get('role'),
		teamId: formData.get('teamId')
	})

	try {
		const response = await prisma.invite.create({
			data: {
				email: parsed.email,
				role: parsed.role,
				invitedBy: user.id,
				teamId: parsed.teamId
			}
		})
		return {
			message: `Successfully invited ${parsed.email}`,
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
