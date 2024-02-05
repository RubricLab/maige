'use server'

import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

// Delete invitation to join a team
export default async function deleteInvitation(id: string, email: string) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	try {
		await prisma.invite.delete({
			where: {
				id: id
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
