import {Suspense} from 'react'
import {ProjectsList} from '~/components/dashboard/Projects/ProjectsList'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

export const dynamic = 'force-dynamic'

export default async function Dashboard({params}: {params: {slug: string}}) {
	const user = await getCurrentUser()

	const memberships = await prisma.membership.findFirst({
		where: {
			userId: user.id,
			team: {
				slug: params.slug
			}
		},
		select: {
			team: {
				include: {
					Project: {
						include: {
							instructions: true,
							organization: true
						}
					}
				}
			}
		}
	})

	if (!memberships) return <p>Could not find team {params.slug}</p>

	const {team} = memberships
	const {Project: projects} = team

	return (
		<div className='flex flex-col items-center'>
			<Suspense fallback={<p>Loading...</p>}>
				<ProjectsList
					username={user.userName}
					teamSlug={params.slug}
					projects={projects}
				/>
			</Suspense>
		</div>
	)
}
