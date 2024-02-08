import env from '~/env.mjs'

export default async function desyncedAgentCall({
	route,
	body
}: {
	route: string
	body: any
}) {
	fetch(`${env.NEXTAUTH_URL}/${route}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.MAIGE_SERVER_SECRET}`
		},
		body: JSON.stringify(body)
	})

	// sleep 100ms
	await new Promise(resolve => setTimeout(resolve, 100))

	return 'dispatched'
}
