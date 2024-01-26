import {getServerSession} from 'next-auth'
import {redirect} from 'next/navigation'
import {Suspense} from 'react'
import {authOptions} from '~/authOptions'

export default async function Page() {
	const session = await getServerSession(authOptions)
	if (!session) redirect('/')

	// const customer = await prisma.customer.findUnique({
	// 	where: {
	// 		githubUserId: session.user.githubUserId
	// 	}
	// })

	// const projects = customer
	// 	? await prisma.project.findMany({
	// 			where: {
	// 				customerId: customer.id
	// 			},
	// 			select: {
	// 				id: true,
	// 				name: true,
	// 				createdAt: true,
	// 				customInstructions: true
	// 			}
	// 		})
	// 	: []

	return (
		<div className='flex flex-col items-center'>
			<Suspense fallback={<p>Loading...</p>}>
				{/* <Repositories projects={projects} /> */}
			</Suspense>
		</div>
	)
}
