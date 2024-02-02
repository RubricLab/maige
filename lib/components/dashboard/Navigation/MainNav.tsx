'use client'

import {TabList} from './TabList'

const routes = [
	{
		name: 'Projects',
		path: ''
	},
	{
		name: 'Usage',
		path: 'usage'
	},
	{
		name: 'Settings',
		path: 'settings'
	}
]

function evaluateActive({activePath, path}) {
	const slug = activePath.split('/')[1]
	if (path === '') return activePath === `/${slug}`
	return activePath.startsWith(`/${slug}/${path}`)
}

function evaluateHref({activePath, path}) {
	const slug = activePath.split('/')[1]
	return `/${slug}/${path}`
}

export default function MainNav() {
	return (
		<TabList
			routes={routes}
			isActive={evaluateActive}
			evaluateHref={evaluateHref}
		/>
	)
}
