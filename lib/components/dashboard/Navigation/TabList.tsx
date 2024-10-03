'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/utils'

export function TabList({
	routes,
	isActive,
	evaluateHref
}: {
	routes: Array<{ name: string; path: string }>
	isActive: (args: { activePath: string; path: string }) => boolean
	evaluateHref: (args: { activePath: string; path: string }) => string
}) {
	const activePath = usePathname()

	return (
		<div className="relative z-10 flex border-tertiary border-b">
			{routes.map((page, index) => (
				<div key={index} className="group -bottom-px relative flex flex-col items-center">
					<Link
						className="mb-1.5 rounded-sm px-4 py-0.5 transition-colors hover:bg-tertiary"
						href={evaluateHref({ path: page.path, activePath })}
					>
						{page.name}
					</Link>
					<div
						className={cn(
							'w-full border-secondary border-b transition-opacity',
							isActive({ activePath, path: page.path }) ? 'opacity-100' : 'opacity-0'
						)}
					/>
				</div>
			))}
		</div>
	)
}
