'use server'

import {z} from 'zod'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

const schema = z.object({
	name: z.string(),
	teamId: z.string()
})

export async function updateTeamDetails(prevState: any, formData: FormData) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const parsed = schema.parse({
		name: formData.get('name'),
		teamId: formData.get('teamId')
	})

	// Check if user making request is part of the team
	const membership = await prisma.membership.findFirst({
		where: {teamId: parsed.teamId, userId: user.id}
	})
	if (!membership)
		return {
			message: 'Unauthorized, not a part of the team',
			type: 'error'
		}

	try {
		await prisma.team.update({
			where: {id: parsed.teamId},
			data: {name: parsed.name}
		})
		return {
			message: `Details updated`,
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
