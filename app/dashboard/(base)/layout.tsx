import {ApplicationProvider} from 'lib/components/dashboard/ApplicationProvider'
import {Toaster} from 'sonner'
import BackgroundGrid from '~/components/background-grid'
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
				<div className='relative h-full w-full flex flex-col'>
				<BackgroundGrid className='fixed opacity-40 h-full w-full' />
				<div className='xl:px-24 bg-transparent z-10 grid w-full'>{children}</div></div>
			</ApplicationProvider>
		</div>
	)
}
