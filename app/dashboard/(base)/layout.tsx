import {ApplicationProvider} from 'lib/components/dashboard/ApplicationProvider'
import {Toaster} from 'sonner'
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
				<div className='flex h-full w-full flex-col'>
					<div className='z-10 grid w-full bg-transparent'>{children}</div>
				</div>
			</ApplicationProvider>
		</div>
	)
}
