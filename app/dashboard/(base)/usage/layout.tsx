import {getServerSession} from 'next-auth'
import {redirect} from 'next/navigation'
import {authOptions} from '~/authOptions'

export default async function Layout({
	children,
    charts,
	table,
}: {
    charts: React.ReactNode,
    table: React.ReactNode,
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions)
	if (!session) redirect('/dashboard')

	return (
		<div>
            {charts}
            {table}
			{children}
		</div>
	)
}
