"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createInstruction(projectId: string, content: string) {
	const req = await prisma.instruction.create({
		data: {
			projectId: projectId,
			content: content,
			creatorUsername: 'Dashboard',
		}
	})
    revalidatePath(`/dashboard/repo/${projectId}/instructions`)
    redirect(`/dashboard/repo/${projectId}/instructions#${req.id}`)
}

export async function deleteInstruction(projectId: string, id: string) {
    await prisma.instruction.delete({
        where: {
            id: id
        }
    })
    revalidatePath(`/dashboard/repo/${projectId}/instructions`)
    redirect(`/dashboard/repo/${projectId}/instructions`)
}