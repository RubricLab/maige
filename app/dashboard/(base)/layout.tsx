import {ApplicationProvider} from 'lib/components/dashboard/ApplicationProvider'
import {Toaster} from 'sonner'
import {MainNavigation} from '~/components/dashboard/Navigation'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex flex-col gap-8'>
			<Toaster />
			<ApplicationProvider>
				<MainNavigation />
				<div className='z-10 grid h-full w-full'>{children}</div>
			</ApplicationProvider>
		</div>
	)
}
