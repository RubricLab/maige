import AcceptInvite from '~/components/dashboard/Team/AcceptInvite'
import prisma from '~/prisma'
import {getCurrentUser} from '~/utils/session'

export const revalidate = 100

export default async function Invite({params}: {params: {inviteId: string}}) {
	const user = await getCurrentUser()
	const invite = await prisma.invite.findUnique({
		where: {id: params.inviteId},
		include: {team: {select: {name: true, slug: true}}}
	})

	return (
		<div className='flex flex-col items-center justify-center gap-4 text-center'>
			{!invite && (
				<>
					<h1>Oops</h1>
					<h3>Invite does not exist or has been revoked.</h3>
				</>
			)}
			{invite && (
				<>
					<h1>Welcome</h1>
					<h3>
						You have been invited to join:{' '}
						<span className='italic'>{invite.team.name ?? invite.team.slug}</span>
					</h3>
					<AcceptInvite
						userId={user ? user.id : null}
						role={invite.role}
						teamId={invite.teamId}
						teamSlug={invite.team.slug}
						inviteId={params.inviteId}
					/>
				</>
			)}
		</div>
	)
}
