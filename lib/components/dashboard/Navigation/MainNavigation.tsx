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
]

export function MainNavigation() {
	const pathname = usePathname()
	return (
		<div className='z-10 flex gap-2 pb-8'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative flex flex-col items-center pb-2'>
					<Link
						className='mb-1 rounded-sm px-2.5 py-0.5 hover:bg-white hover:bg-opacity-20'
						href={`/dashboard${page.path}`}>
						{page.name}
					</Link>
					<div
                        className={cn(
                            'invisible w-[90%] border-b-[2px] group-hover:visible border-b-white border-opacity-50',
                            (page.path === '' && pathname === '/dashboard') || 
                            (page.path !== '' && pathname.startsWith(`/dashboard${page.path}`)) 
                                ? 'visible border-opacity-100' 
                                : ''
                        )}></div>
				</div>
			))}
		</div>
	)
}
