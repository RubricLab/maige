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
		name: 'Instructions',
		path: '/instructions'
	},
    // {
	// 	name: 'Runs',
	// 	path: '/runs'
	// },
	{
		name: 'Settings',
		path: '/settings'
	},
]

export function RepoNavigation() {
	const pathname = usePathname()
    const {projectId} = useParams()
	return (
		<div className='flex gap-2 pb-8'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='relative flex flex-col items-center pb-2'>
					<Link
						className='mb-1 rounded-sm px-2.5 py-0.5 hover:bg-white hover:bg-opacity-20'
						href={`/dashboard/repo/${projectId}${page.path}`}>
						{page.name}
					</Link>
					<div
						className={cn(
							'invisible w-[90%] border-b-[2px] border-b-white',
							pathname == `/dashboard/repo/${projectId}${page.path}` && 'visible'
						)}></div>
				</div>
			))}
		</div>
	)
}
