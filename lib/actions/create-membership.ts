'use server'

import prisma from '~/prisma'
import { getCurrentUser } from '~/utils/session'

// Create membership to join a team by accepting an invitation
export default async function createMembership(inviteId: string) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const invite = await prisma.invite.findUnique({ where: { id: inviteId } })
	if (!invite)
		return {
			message: 'Invite not found',
			type: 'error'
		}

	try {
		await prisma.invite.update({
			where: { id: inviteId },
			data: {
				acceptedBy: user.id,
				acceptedAt: new Date(),
				membership: {
					create: { teamId: invite.teamId, userId: user.id, role: invite.role }
				}
			}
		})
		return {
			message: 'Invitation accepted',
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
