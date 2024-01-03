import {getServerSession} from 'next-auth'
import { redirect } from 'next/navigation'
import {Suspense} from 'react'
import {authOptions} from '~/authOptions'
import {Landing} from '~/components/dashboard/Landing'
import {Repositories} from '~/components/dashboard/Repositories'
import prisma from '~/prisma'

export default async function Page() {
	const session = await getServerSession(authOptions)

	// if (!session) return <Landing />
	if (!session) redirect('/dashboard/auth')

	const customer = await prisma.customer.findUnique({
		where: {
			githubUserId: session.user.githubUserId
		}
	})

	if (!customer) return <></> // need 404 here

	const projects = await prisma.project.findMany({
		where: {
			customerId: customer.id
		}
	})

	return (
		<div className='flex flex-col'>
			<div className='flex flex-col items-center gap-8 h-screen'>
				<Suspense fallback={<p>Loading...</p>}>
					<Repositories projects={projects} />
				</Suspense>
			</div>
		</div>
	)
}
