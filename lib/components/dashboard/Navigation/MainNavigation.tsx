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
		name: 'Settings',
		path: '/settings'
	}
]

export function MainNavigation() {
	const pathname = usePathname()

	return (
		<div className='border-tertiary relative z-10 flex border-b'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative -bottom-px flex flex-col items-center'>
					<Link
						className='hover:bg-primary/10 mb-1 rounded-sm px-2.5 py-0.5'
						href={`/dashboard${page.path}`}>
						{page.name}
					</Link>
					<div
						className={cn(
							'border-secondary w-full border-b transition-opacity',
							(page.path === '' && pathname === '/dashboard') ||
								(page.path !== '' && pathname.startsWith(`/dashboard${page.path}`))
								? 'opacity-100'
								: 'opacity-0 group-hover:opacity-100'
						)}
					/>
				</div>
			))}
		</div>
	)
}
