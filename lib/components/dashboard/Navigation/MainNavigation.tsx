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
	}
]

export function MainNavigation() {
	const pathname = usePathname()
	return (
		<div className='relative z-10 flex border-b-2 border-b-black/20 dark:border-b-white/20'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative -bottom-0.5 flex flex-col items-center'>
					<Link
						className='mb-1 rounded-sm px-3 py-1 hover:bg-black/20 hover:dark:bg-white/20'
						href={`/dashboard${page.path}`}>
						{page.name}
					</Link>
					<div
						className={cn(
							'w-full border-b-2 border-black/50 transition-opacity dark:border-white/50',
							(page.path === '' && pathname === '/dashboard') ||
								(page.path !== '' && pathname.startsWith(`/dashboard${page.path}`))
								? 'opacity-100'
								: 'opacity-0 group-hover:opacity-100'
						)}></div>
				</div>
			))}
		</div>
	)
}
