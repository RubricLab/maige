'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

export default async function createInstruction(
	teamSlug: string,
	projectId: string,
	content: string
) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const response = await prisma.instruction.create({
		data: {
			projectId: projectId,
			content: content,
			creatorUsername: 'Dashboard',
			createdBy: user.id
		}
	})

	if (response) {
		revalidatePath(`/${teamSlug}/project/${projectId}/instructions`)
		redirect(`/${teamSlug}/project/${projectId}/instructions#${response.id}`)
	}
}
