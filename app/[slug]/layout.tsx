import DashboardHeader from '~/components/dashboard/Navigation/DashboardHeader'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

async function Teams() {
	const user = await getCurrentUser()
	if (!user) return <></>

	const teams = await prisma.membership
		.findMany({
			where: {userId: user.id},
			select: {
				team: {
					include: {
						Project: {
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		})
		.then(memberships => memberships.map(m => m.team))

	const projects = teams.reduce((projs, {Project}) => [...projs, ...Project], [])

	return (
		<DashboardHeader
			user={user}
			teams={teams}
			projects={projects}
		/>
	)
}

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='relative min-h-screen w-full px-8'>
			<Teams />
			<div className='w-full'>{children}</div>
		</div>
	)
}
