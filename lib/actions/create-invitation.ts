'use server'

import { Role } from '@prisma/client'
import { headers } from 'next/headers'
import { z } from 'zod'
import { EMAIL } from '~/constants'
import { InviteMember } from '~/emails/invite-member'
import prisma from '~/prisma'
import { resend } from '~/resend'
import { getCurrentUser } from '~/utils/session'

const schema = z.object({
	email: z.string(),
	role: z.nativeEnum(Role),
	teamId: z.string()
})

// Create invitation to join a team
export default async function createInvitation(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	_prevState: any,
	formData: FormData
) {
	const headersList = headers()
	const domain = headersList.get('host')

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

	const membership = await prisma.membership.findFirst({
		where: { teamId: parsed.teamId, userId: user.id },
		include: { team: { select: { name: true } } }
	})
	if (!membership)
		return {
			message: 'Unauthorized, not a part of the team',
			type: 'error'
		}

	try {
		const response = await prisma.invite.create({
			data: {
				email: parsed.email,
				role: parsed.role,
				invitedBy: user.id,
				teamId: parsed.teamId
			}
		})

		const { error } = await resend.emails.send({
			from: EMAIL.FROM,
			to: [parsed.email],
			subject: `${user.name ?? user.userName} invited you to join ${membership.team.name} on Maige`,
			react: InviteMember({
				user: user,
				inviteId: response.id,
				teamName: membership.team.name as string,
				domain: domain as string
			})
		})

		if (error)
			return {
				message: error.message,
				type: 'error'
			}

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
