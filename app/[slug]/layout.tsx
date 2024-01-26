import {DashboardHeader} from '~/components/dashboard/Navigation'
import {getCurrentUser} from '~/utils/session'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const user = await getCurrentUser()
	const teams = await prisma.membership
		.findMany({
			where: {userId: user.id},
			select: {team: true}
		})
		.then(memberships => memberships.map(m => m.team))

	return (
		<div className='relative min-h-screen w-full px-8'>
			{user && (
				<DashboardHeader
					user={user}
					teams={teams}
				/>
			)}
			<div className='w-full'>{children}</div>
		</div>
	)
}
