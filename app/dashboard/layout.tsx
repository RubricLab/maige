import {ApplicationProvider} from 'lib/components/dashboard/ApplicationProvider'
import {Toaster} from 'sonner'
import { MainNavigation } from '~/components/dashboard/Navigation'
import { DashboardHeader } from '~/components/dashboard/Navigation/Header'
import {getServerSession} from 'next-auth'
import {authOptions} from '~/authOptions'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions)
	return (
		<div className='min-h-screen w-full bg-black text-white px-6'>
			<Toaster />
			<ApplicationProvider>
			<DashboardHeader
				session={session}
				avatarUrl={session.user.image}
			/>
				<MainNavigation/>
				{children}
			</ApplicationProvider>
		</div>
	)
}
