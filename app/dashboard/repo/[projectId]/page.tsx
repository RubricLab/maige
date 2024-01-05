import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth'
import {authOptions} from '~/authOptions'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import prisma from '~/prisma'
import Link from 'next/link'

export default async function Page({params}: {params: {projectId: string}}) {
	const session = await getServerSession(authOptions)
	if (!session) redirect('/dashboard')

	const project = await prisma.project.findUnique({
		where: {id: params.projectId}
	})
	return (
		<div className='flex flex-col gap-4'>
			<div className='border-b w-full pb-8 text-2xl font-medium xl:px-[4.25rem]'>
			<span className='inline-flex items-center gap-2'><Link href="/dashboard"><ChevronLeftIcon width="20" height="20"/></Link> {project.name}</span>
			</div>
			<div className='flex flex-col xl:px-24'>
				Coming soon...
			</div>
		</div>
	)
}
