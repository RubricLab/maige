'use server'

import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

// Delete invitation to join a team
export default async function deleteInvitation(
	inviteId: string,
	email: string
) {
	// Check for session
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const invite = await prisma.invite.findUnique({
		where: {id: inviteId},
		include: {team: {include: {memberships: {where: {userId: user.id}}}}}
	})

	// Invite does not exist
	if (!invite)
		return {
			message: 'Invite not found',
			type: 'error'
		}

	// Not a member of the team
	if (!invite.team.memberships || invite.team.memberships.length === 0)
		return {
			message: 'Unauthorized, not a member of this team',
			type: 'error'
		}

	try {
		await prisma.invite.delete({
			where: {
				id: inviteId
			}
		})
		return {
			message: `Canceled invite to ${email}`,
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
