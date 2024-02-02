import {redirect} from 'next/navigation'
import {Suspense} from 'react'
import Projects from '~/components/dashboard/Projects/ProjectsList'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

export default async function Dashboard({params}: {params: {slug: string}}) {
	const user = await getCurrentUser()
	if (!user) redirect('/')

	const team = await prisma.team.findUnique({
		where: {slug: params.slug},
		select: {
			id: true,
			Project: {
				include: {
					instructions: true
				}
			}
		}
	})

	const {Project: projects} = team || {Project: []}

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
