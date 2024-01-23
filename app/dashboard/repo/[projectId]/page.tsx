import {getServerSession} from 'next-auth'
import {redirect} from 'next/navigation'
import {authOptions} from '~/authOptions'
import prisma from '~/prisma'

export default async function Page({params}: {params: {projectId: string}}) {
	const session = await getServerSession(authOptions)
	if (!session) redirect('/dashboard')

	const project = await prisma.project.findUnique({
		where: {id: params.projectId}
	})
	return (
		<div className='flex flex-col gap-4'>
			<p>Coming soon...</p>
		</div>
	)
}
