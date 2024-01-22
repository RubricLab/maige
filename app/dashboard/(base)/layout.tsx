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
			<MainNavigation />
			<div className='z-10 h-full w-full'>{children}</div>
			<Feedback />
		</div>
	)
}
