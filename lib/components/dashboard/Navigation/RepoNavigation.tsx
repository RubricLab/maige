'use client'

import Link from 'next/link'
import {useParams, usePathname} from 'next/navigation'
import {cn} from '~/utils'

const routes = [
	{
		name: 'Overview',
		path: ''
	},
	{
		name: 'Workflows',
		path: '/workflows'
	},
	{
		name: 'Bots',
		path: '/bots'
	},
	{
		name: 'Settings',
		path: '/settings'
	}
]

export function RepoNavigation() {
	const pathname = usePathname()
	const {projectId} = useParams()

	return (
		<div className='border-tertiary relative z-10 flex gap-2 border-b'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative -bottom-px flex flex-col items-center'>
					<Link
						className='hover:bg-primary/10 mb-1 rounded-sm px-2.5 py-0.5'
						href={`/dashboard/repo/${projectId}${page.path}`}>
						{page.name}
					</Link>
					<div
						className={cn(
							'border-secondary w-full border-b transition-opacity',
							(page.path === '' && pathname === `/dashboard/repo/${projectId}`) ||
								(page.path !== '' &&
									pathname.startsWith(`/dashboard/repo/${projectId}${page.path}`))
								? 'opacity-100'
								: 'opacity-0 group-hover:opacity-100'
						)}
					/>
				</div>
			))}
		</div>
	)
}
