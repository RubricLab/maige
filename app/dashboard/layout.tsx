import {ApplicationProvider} from 'lib/components/dashboard/ApplicationProvider'
import {Toaster} from 'sonner'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='min-h-screen w-full bg-black text-white'>
			<Toaster />
			<ApplicationProvider>{children}</ApplicationProvider>
		</div>
	)
}
