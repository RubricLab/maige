import {ExistingMembers, InviteDialog} from '~/components/dashboard/Settings'
import PendingInvitations from '~/components/dashboard/Settings/PendingInvitations'
import prisma from '~/prisma'

export default async function Members({params}: {params: {slug: string}}) {
	const team = await prisma.team.findUnique({
		where: {slug: params.slug},
		select: {
			id: true,
			memberships: {
				select: {role: true, user: {select: {email: true, createdAt: true}}}
			},
			invites: {
				where: {acceptedBy: null},
				select: {email: true, role: true, createdAt: true}
			}
		}
	})
	return (
		<div className='flex flex-col gap-4 py-0.5'>
			<div className='flex items-center justify-between gap-2'>
				<h3>Members</h3>
				<InviteDialog teamId={team.id} />
			</div>
			<ExistingMembers members={team.memberships} />
			<PendingInvitations invites={team.invites} />
		</div>
	)
}
