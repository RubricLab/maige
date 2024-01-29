'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import prisma from '~/prisma'

export default async function deleteInstruction(
	teamSlug: string,
	projectId: string,
	instructionId: string
) {
	await prisma.instruction.delete({
		where: {
			id: instructionId
		}
	})
	revalidatePath(`/${teamSlug}/project/${projectId}/instructions`)
	redirect(`/${teamSlug}/project/${projectId}/instructions`)
}
