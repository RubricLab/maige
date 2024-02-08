'use client'

import {TabList} from './TabList'

const routes = [
	{
		name: 'Overview',
		path: ''
	},
	{
		name: 'Instructions',
		path: 'instructions'
	},
	{
		name: 'Usage',
		path: 'usage'
	},
	{
		name: 'Settings',
		path: 'settings'
	},
]

function evaluatePath(path: string, repoSlug: string, projectId: string) {
	if (path === '') return `/${repoSlug}/project/${projectId}`
	if (path === 'usage') return `/${repoSlug}/usage?proj=${projectId}`
	return `/${repoSlug}/project/${projectId}/${path}`
}

function evaluateActive({
	path,
	activePath
}: {
	path: string
	activePath: string
}) {
	if (path === '') return activePath.split('/').length === 4
	return activePath.endsWith(path)
}

export default function ProjectNav({
	repoSlug,
	projectId
}: {
	repoSlug: string
	projectId: string
}) {
	return (
		<TabList
			routes={routes}
			isActive={evaluateActive}
			evaluateHref={page => evaluatePath(page.path, repoSlug, projectId)}
		/>
	)
}
