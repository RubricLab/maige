import {getServerSession} from 'next-auth'
import {redirect} from 'next/navigation'
import {authOptions} from '~/authOptions'
import {
	MainNavigation,
	ProjectNavigation
} from '~/components/dashboard/Navigation'

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
		<div className='flex flex-col p-8'>
			<MainNavigation
				session={session}
				avatarUrl={session.user.image}
			/>
			<ProjectNavigation projectName={project.name} />
			{children}
		</div>
	)
}
