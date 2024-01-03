'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {cn} from '~/utils'

const routes = [
	{
		name: 'Repositories',
		path: ''
	},
	{
		name: 'Usage',
		path: '/usage'
	},
	{
		name: 'Agents',
		path: '/agents'
	},
	{
		name: 'Runs',
		path: '/runs'
	}
]

export function MainNavigation() {
	const pathname = usePathname()
	return (
		<div className='flex gap-2 pb-8 z-10'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='relative flex flex-col items-center pb-2'>
					<Link
						className='mb-1 rounded-sm px-2.5 py-0.5 hover:bg-white hover:bg-opacity-20'
						href={`/dashboard${page.path}`}>
						{page.name}
					</Link>
					<div
						className={cn(
							'invisible w-[90%] border-b-[2px] border-b-white',
							pathname == `/dashboard${page.path}` && 'visible'
						)}></div>
				</div>
			))}
		</div>
	)
}
