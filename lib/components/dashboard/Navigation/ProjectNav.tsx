'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {cn} from '~/utils'

const routes = [
	{
		name: 'Overview',
		path: ''
	},
	{
		name: 'Instructions',
		path: 'instructions'
	},
	{
		name: 'Settings',
		path: 'settings'
	}
]

function evaluatePath(path: string, repoSlug: string, projectId: string) {
	if (path === '') return `/${repoSlug}/project/${projectId}`
	return `/${repoSlug}/project/${projectId}/${path}`
}

export default function ProjectNav({
	repoSlug,
	projectId
}: {
	repoSlug: string
	projectId: string
}) {
	const pathname = usePathname()

	return (
		<div className='border-tertiary relative z-10 flex border-b'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative -bottom-px flex flex-col items-center'>
					<Link
						className='hover:bg-primary/10 mb-1 rounded-sm px-2.5 py-0.5'
						href={evaluatePath(page.path, repoSlug, projectId)}>
						{page.name}
					</Link>
					<div
						className={cn(
							'border-secondary w-full border-b transition-opacity',
							(page.path === '' && pathname.split('/').length === 4) ||
								(page.path !== '' && pathname.endsWith(page.path))
								? 'opacity-100'
								: 'opacity-0 group-hover:opacity-100'
						)}
					/>
				</div>
			))}
		</div>
	)
}
