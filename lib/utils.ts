import {clsx, type ClassValue} from 'clsx'
import {toast} from 'sonner'
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

// Convert any input to title case format e.g: Admin
export function convertToTitleCase(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()
}

// Parse date object into appropriate string format
export function parseDate(input: Date): string {
	return input.toLocaleDateString('en-US', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	})
}

// Copy text to clipboard
export function copyToClipboard(input: string, message?: string) {
	navigator.clipboard.writeText(input)
	toast.success(message ?? 'Copied to clipboard')
}
