'use server'

import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

// Delete invitation to join a team
export default async function deleteMember(
	teamId: string,
	membershipId: string,
	memberUserId: string,
	memberEmail: string
) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	// Check membership of user triggering delete
	const membership = await prisma.membership.findFirst({
		where: {AND: [{teamId: teamId, userId: user.id}]}
	})

	// Scenarios in which a request should be disallowed:
	// 1. user making request is not in the team
	// 2. non-admin user is making request
	// 3. user is trying to remove themself
	if (!membership || membership.role === 'USER' || user.id === memberUserId)
		return {
			message: 'Unauthorized, not allowed to remove member',
			type: 'error'
		}

	try {
		await prisma.membership.delete({
			where: {
				id: membershipId
			}
		})
		return {
			message: `Removed ${memberEmail}`,
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
