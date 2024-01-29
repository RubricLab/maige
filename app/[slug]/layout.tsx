import DashboardHeader from '~/components/dashboard/Navigation/DashboardHeader'
import {getCurrentUser} from '~/utils/session'

async function Teams() {
	const user = await getCurrentUser()
	if (!user) return <></>

	const teams = await prisma.membership
		.findMany({
			where: {userId: user.id},
			select: {team: true}
		})
		.then(memberships => memberships.map(m => m.team))

	return (
		<DashboardHeader
			user={user}
			teams={teams}
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
