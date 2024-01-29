'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {cn} from '~/utils'

const routes = [
	{
		name: 'Projects',
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

export default function MainNav() {
	const pathname = usePathname()
	const slug = pathname.split('/')[1]

	return (
		<div className='border-tertiary relative z-10 flex border-b'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative -bottom-px flex flex-col items-center'>
					<Link
						className='hover:bg-primary/10 mb-1 rounded-sm px-2.5 py-0.5'
						href={`/${slug}/${page.path}`}>
						{page.name}
					</Link>
					<div
						className={cn(
							'border-secondary w-full border-b transition-opacity',
							(page.path === '' && pathname === '/[slug]') ||
								(page.path !== '' && pathname.startsWith(`/[slug]/${page.path}`))
								? 'opacity-100'
								: 'opacity-0 group-hover:opacity-100'
						)}
					/>
				</div>
			))}
		</div>
	)
}
