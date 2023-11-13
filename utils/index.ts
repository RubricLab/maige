import {createHmac, timingSafeEqual} from 'crypto'
import {env} from '~/env.mjs'

export const isDev = env.NODE_ENV === 'development'

// Validate the GitHub webhook signature
export const validateSignature = async (
	payload: string,
	signature: string
): Promise<boolean> => {
	const signatureBuffer = Buffer.from(signature, 'utf-8')

	const HMAC = createHmac('sha256', env.GITHUB_WEBHOOK_SECRET || '')
		.update(`${payload}`)
		.digest('hex')
	const digest = Buffer.from(`sha256=${HMAC}`, 'utf-8')

	const isValid = timingSafeEqual(digest, signatureBuffer)

	return isValid
}

// Trim text to a max length
export const truncate = (text: string, length: number): string => {
	if (!text) return ''

	text.length > length ? text.slice(0, length) + '...' : text

	return text
}
