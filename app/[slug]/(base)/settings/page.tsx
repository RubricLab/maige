import {DeleteTeam, InviteDialog} from '~/components/dashboard/Settings'
import prisma from '~/prisma'

export default async function Settings({params}: {params: {slug: string}}) {
	const team = await prisma.team.findUnique({
		where: {slug: params.slug},
		select: {id: true}
	})
	return (
		<div className='flex h-full w-full flex-col gap-4'>
			<h2 className='font-sans text-2xl'>Settings</h2>
			<div className='flex items-center gap-2'>
				<h3>Members</h3>
				<InviteDialog teamId={team.id} />
			</div>

			<div className='flex flex-col gap-2'>
				<h3>Advanced</h3>
				<DeleteTeam />
			</div>
		</div>
	)
}
