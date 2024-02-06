'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

const routes = [
	{
		name: 'Members',
		path: 'members'
	},
	{
		name: 'Billing',
		path: 'billing'
	},
	{
		name: 'Advanced',
		path: 'advanced'
	}
]

export default function SettingsNav({
	teamSlug,
	projectId
}: {
	teamSlug: string
	projectId: string
}) {
	const pathname = usePathname()
	return (
		<div className='flex w-[200px] flex-col gap-2'>
			{routes.map(route => (
				<Link
					key={route.name}
					href={`/${teamSlug}/settings/${route.path}`}
					className={`hover:bg-tertiary rounded-sm px-4 py-2 transition-colors ${pathname === `/${teamSlug}/settings${route.path}` && 'bg-tertiary'}`}>
					{route.name}
				</Link>
			))}
		</div>
	)
}
