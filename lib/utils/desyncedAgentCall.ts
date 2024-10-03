import env from '~/env'

export default async function desyncedAgentCall({
	route,
	body
}: {
	route: string
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
