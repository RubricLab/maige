import {NextRequest} from 'next/server'

const validateAgentCall = (headers: Headers) => {
	if (!(headers.get('Authorization') === `Bearer ${env.MAIGE_SERVER_SECRET}`))
		throw new Error('Webhook signature could not be verified')
}

const agentMatch = /^\/agent\/.*$/

export default function middleware(req: NextRequest) {
	switch (true) {
		case req.nextUrl.pathname.match(agentMatch) !== null:
			validateAgentCall(req.headers)
		default:
	}
}
