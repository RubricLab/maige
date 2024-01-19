import {ApplicationProvider} from 'lib/components/dashboard/ApplicationProvider'
import {Toaster} from 'sonner'
import {MainNavigation} from '~/components/dashboard/Navigation'
import Feedback from '~/components/feedback/feedback'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='space-y-4'>
			<Toaster position='top-right' />
			<ApplicationProvider>
				<MainNavigation />
				<div className='z-10 grid h-full w-full'>{children}</div>
			</ApplicationProvider>
			<Feedback />
		</div>
	)
}
