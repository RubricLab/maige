import {Role} from '@prisma/client'
import {convertToTitleCase, parseDate} from '~/utils'

type Member = {
	user: {
		email: string
		createdAt: Date
	}
	role: Role
}

export default function ExistingMembers({members}: {members: Member[]}) {
	return (
		<div className='flex flex-col gap-2'>
			<p className='text-xl'>Existing members</p>
			<div className='rounded-md border'>
				<div className='border-border grid grid-cols-3 border-b px-4 py-1 text-sm'>
					<p>Email</p>
					<p>Role</p>
					<p>Member since</p>
				</div>
				{members.map(m => (
					<div
						key={m.user.email}
						className='border-border grid grid-cols-3 rounded-sm border-b p-4'>
						<p>{m.user.email}</p>
						<p>{convertToTitleCase(m.role)}</p>
						<p>{parseDate(m.user.createdAt)}</p>
					</div>
				))}
			</div>
		</div>
	)
}
