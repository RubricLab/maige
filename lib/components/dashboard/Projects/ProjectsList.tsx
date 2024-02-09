import {ArrowLeft} from 'lucide-react'
import {ProjectWithInstructions} from '~/types/prisma'
import CreateProjectIntent from './CreateProjectIntent'
import ProjectCard from './ProjectCard'

const EmptyState = () => (
	<div className='center gap-4 text-center'>
		<h3>Welcome to Maige!</h3>
		<div className='flex items-center gap-2'>
			<ArrowLeft className='h-5 w-5' />
			<p className='text-secondary'>To get started, add a repo</p>
		</div>
		<p className='text-tertiary text-sm'>
			If you expect to see a repo, try refreshing.
		</p>
	</div>
)

export function ProjectsList({
	teamSlug,
	username,
	projects
}: {
	teamSlug: string
	username: string
	projects: ProjectWithInstructions[]
}) {
	return (
		<div className='grid w-full gap-4 sm:grid-cols-4'>
			<CreateProjectIntent teamSlug={teamSlug} />
			{projects.length > 0 ? (
				projects.map(p => (
					<ProjectCard
						key={p.id}
						username={username}
						teamSlug={teamSlug}
						project={p}
					/>
				))
			) : (
				<EmptyState />
			)}
		</div>
	)
}
