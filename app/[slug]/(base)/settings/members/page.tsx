import {redirect} from 'next/navigation'
import {
	ExistingMembers,
	InviteDialog,
	PendingInvitations
} from '~/components/dashboard/Settings'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

export default async function Members({params}: {params: {slug: string}}) {
	const user = await getCurrentUser()
	if (!user) redirect('/')

	const team = await prisma.team.findFirst({
		where: {slug: params.slug, memberships: {some: {userId: user.id}}},
		select: {
			id: true,
			memberships: {
				select: {
					id: true,
					role: true,
					user: {select: {id: true, email: true, createdAt: true}}
				}
			},
			invites: {
				where: {acceptedBy: null},
				select: {id: true, email: true, role: true, createdAt: true}
			}
		}
	})
	if (!team) redirect('/')

	return (
		<div className='flex flex-col gap-6 py-0.5'>
			<div className='flex items-center justify-between gap-2'>
				<h3>Members</h3>
				<InviteDialog teamId={team.id} />
			</div>
			<ExistingMembers members={team.memberships} />
			{team.invites.length > 0 && <PendingInvitations invites={team.invites} />}
		</div>
	)
}
