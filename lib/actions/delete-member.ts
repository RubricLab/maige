'use server'

import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

// Delete invitation to join a team
export default async function deleteMember(membershipId: string) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	// Get the membership record that needs to be deleted
	const targetMembership = await prisma.membership.findUnique({
		where: {id: membershipId},
		include: {user: {select: {id: true, email: true, userName: true}}}
	})

	if (!targetMembership)
		return {
			message: 'User does not exist in the team',
			type: 'error'
		}

	// Check membership of user triggering delete
	const userMembership = await prisma.membership.findFirst({
		where: {AND: [{teamId: targetMembership.teamId, userId: user.id}]}
	})

	// 1. user making request is not in the team
	// 2. non-admin user is making request
	if (!userMembership || userMembership.role === 'USER')
		return {
			message: 'Unauthorized, not allowed to remove member',
			type: 'error'
		}

	// 1. attempting to remove an admin
	// 2. user is trying to remove themself
	if (targetMembership.role === 'ADMIN' || user.id === targetMembership.user.id)
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
			message: `Removed ${targetMembership.user.email ?? targetMembership.user.userName}`,
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
