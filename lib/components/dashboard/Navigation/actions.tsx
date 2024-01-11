'use server'
import prisma from "~/prisma"
export async function getProject(projectId: string) {
	const project = await prisma.project.findUnique({
		where: {id: projectId}
	})
	return project
}