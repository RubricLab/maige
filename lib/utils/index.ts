import env from '~/env'

export const isDev = env.NODE_ENV === 'development'

// Trim text to a max length
export const truncate = (text: string, length: number): string => {
	if (!text) return ''

	text.length > length ? `${text.slice(0, length)}...` : text

	return text
}
