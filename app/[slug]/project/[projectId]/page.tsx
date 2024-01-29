import prisma from '~/prisma'

export default async function Page({params}: {params: {projectId: string}}) {
	const project = await prisma.project.findUnique({
		where: {id: params.projectId}
	})
	return (
		<div className='flex flex-col gap-4'>
			<h3>{project.name}</h3>
		</div>
	)
}
