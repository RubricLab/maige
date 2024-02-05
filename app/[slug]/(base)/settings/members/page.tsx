import {
	ExistingMembers,
	InviteDialog,
	PendingInvitations
} from '~/components/dashboard/Settings'
import prisma from '~/prisma'

export default async function Members({params}: {params: {slug: string}}) {
	const team = await prisma.team.findUnique({
		where: {slug: params.slug},
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
	return (
		<div className='flex flex-col gap-6 py-0.5'>
			<div className='flex items-center justify-between gap-2'>
				<h3>Members</h3>
				<InviteDialog teamId={team.id} />
			</div>
			<ExistingMembers
				teamId={team.id}
				members={team.memberships}
			/>
			{team.invites.length > 0 && <PendingInvitations invites={team.invites} />}
		</div>
	)
}
