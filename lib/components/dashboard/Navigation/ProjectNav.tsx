'use client'

import Link from 'next/link'

const routes = [
	{
		name: 'Overview',
		path: '/'
	},
	{
		name: 'Instructions',
		path: '/instructions'
	},
	{
		name: 'Settings',
		path: '/settings'
	}
]

function evaluatePath(path: string, repoSlug: string, projectId: string) {
	if (path === '/') return `/${repoSlug}/project/${projectId}`
	return `/${repoSlug}/project/${projectId}${path}`
}

export default function ProjectNav({
	repoSlug,
	projectId
}: {
	repoSlug: string
	projectId: string
}) {
	return (
		<div className='border-tertiary relative z-10 flex gap-2 border-b'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative -bottom-px flex flex-col items-center'>
					<Link
						className='hover:bg-primary/10 mb-1 rounded-sm px-2.5 py-0.5'
						href={evaluatePath(page.path, repoSlug, projectId)}>
						{page.name}
					</Link>
					<div className='border-secondary w-full border-b opacity-0 transition-opacity group-hover:opacity-100' />
				</div>
			))}
		</div>
	)
}
