'use server'

import {Role} from '@prisma/client'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

// Create membership to join a team by accepting an invitation
export default async function createMembership(
	inviteId: string,
	teamId: string,
	userId: string,
	role: Role
) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	try {
		await prisma.invite.update({
			where: {id: inviteId},
			data: {
				acceptedBy: userId,
				acceptedAt: new Date(),
				membership: {create: {teamId: teamId, userId: userId, role: role}}
			}
		})
		return {
			message: `Invitation accepted`,
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
