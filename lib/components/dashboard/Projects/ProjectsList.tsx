import {ArrowRight} from 'lucide-react'
import Link from 'next/link'
import {ProjectWithInstructions} from '~/types/prisma'
import {timeAgo} from '~/utils'
import CreateProjectIntent from './CreateProjectIntent'

const EmptyState = () => (
	<div className='center gap-4 text-center'>
		<h3>Welcome to Maige!</h3>
		<div className='flex items-center gap-2'>
			<p className='text-secondary'>To get started, add a repo</p>
			<ArrowRight className='h-5 w-5' />
		</div>
		<p className='text-tertiary text-sm'>
			If you expect to see a repo, try refreshing.
		</p>
	</div>
)

export default function ProjectsList({
	teamId,
	slug,
	projects
}: {
	teamId: string
	slug: string
	projects: ProjectWithInstructions[]
}) {
	return (
		<div className='grid w-full gap-4 sm:grid-cols-4'>
			{projects.length > 0 ? (
				projects.map(project => (
					<Link
						className='border-tertiary hover:border-secondary relative flex h-36 w-full cursor-pointer flex-col justify-between rounded-sm border p-4 py-3.5 transition-opacity duration-300'
						href={`${slug}/project/${project.id}/instructions`} // TODO: remove after populating Overview tab
						key={project.id}>
						<div className='flex w-full items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div className='relative'>
									<div className='h-6 w-6 rounded-full bg-foreground' />
									<p className='absolute left-0 right-0 top-1/2 m-auto -translate-y-1/2 text-center font-medium leading-none text-background'>
										{project.name.charAt(0).toUpperCase()}
									</p>
								</div>
								<p className='text-lg'>{project.name}</p>
							</div>
						</div>
						<div className='flex flex-col gap-1'>
							<span className='font-medium'>
								{project.instructions?.length} Custom Instructions
							</span>
							<span className='text-sm text-gray-500'>
								Added {timeAgo(project.createdAt)}
							</span>
						</div>
					</Link>
				))
			) : (
				<EmptyState />
			)}
			<CreateProjectIntent teamId={teamId} />
		</div>
	)
}
