import {getServerSession} from 'next-auth'
import {redirect} from 'next/navigation'
import {authOptions} from '~/authOptions'

export default async function Page({params}: {params: {projectId: string}}) {
	const session = await getServerSession(authOptions)
	if (!session) redirect('/dashboard')

	return (
		<div className='flex flex-col gap-4'>
			<p>Coming soon...</p>
		</div>
	)
}
