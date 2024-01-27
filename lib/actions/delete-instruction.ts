'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'

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
