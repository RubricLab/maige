import Link from 'next/link'
import {ProjectWithInstructions} from '~/types/prisma'
import {timeAgo} from '~/utils'
import AddProject from './AddProject'

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
			{projects.map(project => (
				<Link
					className='border-tertiary hover:border-secondary relative flex h-36 w-full cursor-pointer flex-col justify-between rounded-lg border p-4 py-3.5 transition-opacity duration-300'
					href={`${slug}/project/${project.id}`}
					key={project.id}>
					<div className='flex w-full items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='relative'>
								<div className='h-6 w-6 rounded-full bg-foreground' />
								<p className='text-secondary absolute left-0 right-0 top-1/2 m-auto -translate-y-1/2 text-center font-medium leading-none'>
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
			))}
			<AddProject teamId={teamId} />
		</div>
	)
}
