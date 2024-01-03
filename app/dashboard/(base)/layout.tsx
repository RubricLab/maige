import {ApplicationProvider} from 'lib/components/dashboard/ApplicationProvider'
import {getServerSession} from 'next-auth'
import {Toaster} from 'sonner'
import {authOptions} from '~/authOptions'
import {MainNavigation} from '~/components/dashboard/Navigation'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div>
			<Toaster />
			<ApplicationProvider>
				<MainNavigation />
				<div className='xl:px-24'>{children}</div>
			</ApplicationProvider>
		</div>
	)
}
