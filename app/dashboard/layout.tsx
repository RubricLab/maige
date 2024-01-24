import {getServerSession} from 'next-auth'
import {authOptions} from '~/authOptions'
import {DashboardHeader} from '~/components/dashboard/Navigation/Header'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions)

	return (
		<div className='relative min-h-screen w-full px-8'>
			{session && (
				<DashboardHeader
					session={session}
					avatarUrl={session.user.image}
				/>
			)}
			<div className='w-full'>{children}</div>
		</div>
	)
}
