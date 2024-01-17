import {getServerSession} from 'next-auth'
import {authOptions} from '~/authOptions'
import BackgroundGrid from '~/components/background-grid'
import {DashboardHeader} from '~/components/dashboard/Navigation/Header'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions)

	return (
		<div className='relative min-h-screen w-full bg-black px-8 text-white'>
			<BackgroundGrid className='absolute left-0 right-0 -z-10 h-full w-full opacity-10' />
			{session ? (
				<DashboardHeader
					session={session}
					avatarUrl={session.user.image}
				/>
			) : null}
			<div className='w-full'>{children}</div>
		</div>
	)
}
