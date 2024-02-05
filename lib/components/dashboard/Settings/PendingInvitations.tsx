import {Role} from '@prisma/client'
import {convertToTitleCase, parseDate} from '~/utils'

type Invite = {
	createdAt: Date
	role: Role
	email: string
}

export default function PendingInvitations({invites}: {invites: Invite[]}) {
	return (
		<div className='flex flex-col gap-2'>
			<p className='text-xl'>Pending invites</p>
			<div className='rounded-md border'>
				<div className='border-border grid grid-cols-3 border-b px-4 py-1 text-sm'>
					<p>Email</p>
					<p>Role</p>
					<p>Invited at</p>
				</div>
				{invites.map(i => (
					<div
						key={i.email}
						className='border-border grid grid-cols-3 rounded-sm border-b p-4'>
						<p>{i.email}</p>
						<p>{convertToTitleCase(i.role)}</p>
						<p>{parseDate(i.createdAt)}</p>
					</div>
				))}
			</div>
		</div>
	)
}
