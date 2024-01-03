'use server'

export async function getProject(projectId: string) {
	const project = await prisma.project.findUnique({
		where: {id: projectId}
	})
	return project
}