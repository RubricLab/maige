'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {cn} from '~/utils'

export function TabList({
	routes,
	isActive,
	evaluateHref
}: {
	routes: Array<{name: string; path: string}>
	isActive: (args: {activePath: string; path: string}) => boolean
	evaluateHref: (args: {activePath: string; path: string}) => string
}) {
	const activePath = usePathname()

	return (
		<div className='border-tertiary relative z-10 flex border-b'>
			{routes.map((page, index) => (
				<div
					key={index}
					className='group relative -bottom-px flex flex-col items-center'>
					<Link
						className='hover:bg-tertiary mb-1.5 rounded-sm px-4 py-0.5 transition-colors'
						href={evaluateHref({path: page.path, activePath})}>
						{page.name}
					</Link>
					<div
						className={cn(
							'border-secondary w-full border-b transition-opacity',
							isActive({activePath, path: page.path}) ? 'opacity-100' : 'opacity-0'
						)}
					/>
				</div>
			))}
		</div>
	)
}
