'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {getCurrentUser} from '~/utils/session'

export default async function deleteInstruction(
	teamSlug: string,
	projectId: string,
	instructionId: string
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
				id: instructionId
			}
		})
		revalidatePath(`/${teamSlug}/project/${projectId}/instructions`)
		redirect(`/${teamSlug}/project/${projectId}/instructions`)
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
