import {redirect} from 'next/navigation'
import {Suspense} from 'react'
import {Repositories} from '~/components/dashboard/Repositories'
import {getCurrentUser} from '~/utils/session'

export default async function Dashboard({params}: {params: {slug: string}}) {
	const user = await getCurrentUser()
	if (!user) redirect('/')

	const team = await prisma.team.findUnique({
		where: {slug: params.slug},
		select: {id: true}
	})
	const projects = await prisma.project.findMany({
		where: {
			userId: user.id,
			teamId: team.id
		},
		select: {
			id: true,
			name: true,
			createdAt: true,
			userId: true,
			teamId: true,
			instructions: true
		}
	})

	return (
		<div className='flex flex-col items-center'>
			<Suspense fallback={<p>Loading...</p>}>
				<Repositories slug={params.slug} projects={projects} />
			</Suspense>
		</div>
	)
}
