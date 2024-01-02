import {getServerSession} from 'next-auth'
import {redirect} from 'next/navigation'
import {authOptions} from '~/authOptions'
import { RepoNavigation } from '~/components/dashboard/Navigation/RepoNavigation'

export default async function Layout({
	params,
	children
}: {
	params: {projectId: string}
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions)
	if (!session) redirect('/dashboard')

	const project = await prisma.project.findUnique({
		where: {id: params.projectId}
	})

	return (
		<div>
			<RepoNavigation projectName={project.name} />
			{children}
		</div>
	)
}
