import {ExternalLinkIcon} from 'lucide-react'
import Link from 'next/link'
import {ProjectWithInstructions} from '~/types/prisma'
import {timeAgo} from '~/utils'

export default function ProjectCard({
	username,
	teamSlug,
	project
}: {
	username: string
	teamSlug: string
	project: ProjectWithInstructions
}) {
	return (
		<Link
			className='border-tertiary hover:border-secondary relative flex h-36 w-full cursor-pointer flex-col justify-between rounded-sm border p-4 py-3.5 transition-all'
			href={`${teamSlug}/project/${project.id}/instructions`} // TODO: remove after populating Overview tab
		>
			<div className='flex w-full items-center justify-between'>
				<div className='flex w-full items-center gap-3'>
					<div className='relative'>
						<div className='h-6 w-6 rounded-full bg-foreground' />
						<p className='absolute left-0 right-0 top-1/2 m-auto -translate-y-1/2 text-center font-medium leading-none text-background'>
							{project.name.charAt(0).toUpperCase()}
						</p>
					</div>
					<p className='text-lg'>{project.name}</p>
					<div className='grow' />
					<Link
						href={`https://github.com/${project.organization ? project.organization?.slug : username}/${project.name}`}
						className='bg-tertiary hover:bg-secondary text-secondary rounded-full p-1 transition-colors'>
						<ExternalLinkIcon className='text-tertiary h-4 w-4' />
					</Link>
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
	)
}
