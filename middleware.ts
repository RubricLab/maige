import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'
import {NextFetchEvent, NextRequest, NextResponse} from 'next/server'
import env from './lib/env.mjs'

const redis = new Redis({
	url: env.UPSTASH_REDIS_REST_URL,
	token: env.UPSTASH_REDIS_REST_TOKEN
})

// Declaring the ratelimit object outside the middleware handler enables caching
const ratelimit = new Ratelimit({
	redis: redis,
	limiter: Ratelimit.slidingWindow(20, '10 s')
})

export default async function middleware(
	request: NextRequest,
	event: NextFetchEvent
): Promise<Response | undefined> {
	const {pathname} = request.nextUrl
	const ip = request.ip ?? '127.0.0.1'
	const {success} = await ratelimit.limit(ip)

	// API rate limiting
	if (pathname.startsWith('/api'))
		return success
			? NextResponse.next()
			: NextResponse.json(
					{success: false, message: 'Rate limit exceeded'},
					{status: 429}
				)

	// Pages rate limiting
	return success
		? NextResponse.next()
		: NextResponse.redirect(new URL('/blocked', request.url))
}

export const config = {
	// Match all pages, and API routes
	matcher: ['/', '/api/:function*']
}
