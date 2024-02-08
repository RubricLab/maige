import TeamNav from '~/components/dashboard/Navigation/TeamNav'

export default async function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className='space-y-4'>
			<TeamNav />
			<div className='z-10 h-full w-full'>{children}</div>
		</div>
	)
}
