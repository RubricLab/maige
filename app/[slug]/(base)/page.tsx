import {redirect} from 'next/navigation'
import {Suspense} from 'react'
import Projects from '~/components/dashboard/Projects/List'
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
			teamId: team.id
		},
		include: {
			instructions: true
		}
	})

	return (
		<div className='flex flex-col items-center'>
			<Suspense fallback={<p>Loading...</p>}>
				<Projects
					teamId={team.id}
					slug={params.slug}
					projects={projects}
				/>
			</Suspense>
		</div>
	)
}
