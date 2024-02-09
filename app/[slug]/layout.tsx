import {notFound, redirect} from 'next/navigation'
import DashboardNav from '~/components/dashboard/Navigation/DashboardNavServer'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

export default async function RootLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: {slug: string}
}) {
	// Ensure all dashboard routes are protected
	const user = await getCurrentUser()
	if (!user) return redirect('/')

	// Ensure user is a member of the team being accessed
	const team = await prisma.team.findFirst({
		where: {slug: params.slug, memberships: {some: {userId: user.id}}}
	})
	if (!team) return notFound()

	return (
		<div className='relative min-h-screen w-full px-8'>
			<DashboardNav user={user} />
			<div className='w-full'>{children}</div>
		</div>
	)
}
