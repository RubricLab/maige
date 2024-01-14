import {getServerSession} from 'next-auth'
import {redirect} from 'next/navigation'
import {authOptions} from '~/authOptions'
import { RepoNavigation } from '~/components/dashboard/Navigation/RepoNavigation'

export default async function Layout({
	children
}: {
	params: {projectId: string}
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions)
	if (!session) redirect('/dashboard')

	return (
		<div>
			<RepoNavigation />
			{children}
		</div>
	)
}