'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {cn} from '~/utils'

const routes = [
	{
		name: 'Repositories',
		path: '/dashboard'
	},
	{
		name: 'Usage',
		path: '/dashboard/usage'
	},
	{
		name: 'Agents',
		path: '/dashboard/agents'
	},
	{
		name: 'Runs',
		path: '/dashboard/runs'
	}
]

export function MainNavigation() {
	const pathname = usePathname()
	return (
		<div className='flex gap-2'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='relative flex flex-col items-center pb-2'>
					<Link
						className='mb-1 rounded-sm px-2 py-1 hover:bg-white hover:bg-opacity-20'
						href={page.path}>
						{page.name}
					</Link>
					<div
						className={cn(
							'invisible w-[90%] border-b-[2px] border-b-white',
							pathname == page.path && 'visible'
						)}></div>
				</div>
			))}
		</div>
	)
}
