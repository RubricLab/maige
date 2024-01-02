import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth'
import {authOptions} from '~/authOptions'

export default async function Page({params}: {params: {projectId: string}}) {
	const session = await getServerSession(authOptions)
	if (!session) redirect('/dashboard')

	const project = await prisma.project.findUnique({
		where: {id: params.projectId}
	})
	return (
		<div className='flex flex-col'>
			<div className='border-b w-full pb-8 text-2xl font-medium xl:px-24'>
			{project.name}
			</div>
			<div className='flex flex-col xl:px-24'>

			</div>
		</div>
	)
}
