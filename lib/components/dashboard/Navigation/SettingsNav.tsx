'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const routes = [
	{
		name: 'General',
		path: 'general'
	},
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

export default function SettingsNav({ teamSlug }: { teamSlug: string }) {
	const pathname = usePathname()
	return (
		<div className="flex w-[200px] flex-col gap-2">
			{routes.map(route => (
				<Link
					key={route.name}
					href={`/${teamSlug}/settings/${route.path}`}
					className={`rounded-sm px-4 py-2 transition-colors hover:bg-tertiary ${pathname === `/${teamSlug}/settings/${route.path}` && 'bg-tertiary'}`}
				>
					{route.name}
				</Link>
			))}
		</div>
	)
}
