'use server'
import {Instruction} from '@prisma/client'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

export default async function deleteInstruction(
	teamSlug: string,
	instruction: Instruction
) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	try {
		await prisma.instruction.delete({
			where: {
				id: instruction.id
			}
		})
		revalidatePath(`/${teamSlug}/project/${instruction.projectId}/instructions`)
		redirect(`/${teamSlug}/project/${instruction.projectId}/instructions`)
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
