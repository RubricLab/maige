import {Toaster} from 'sonner'
import MainNav from '~/components/dashboard/Navigation/MainNav'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='space-y-4'>
			<Toaster position='bottom-right' />
			<MainNav />
			<div className='z-10 h-full w-full'>{children}</div>
		</div>
	)
}
