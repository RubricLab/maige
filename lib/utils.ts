import {clsx, type ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Calculate time ago
export function timeAgo(timestamp: Date) {
	const date = new Date(timestamp)
	const daysAgo = Math.floor(
		(new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
	)
	return daysAgo === 0
		? 'today'
		: `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`
}

// Convert string to a slug
export function slugify(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
}

// Get project URL from team slug and project id
export function getProjectUrl(teamSlug: string, projectId: string): string {
	return `/${teamSlug}/project/${projectId}/instructions`
}
