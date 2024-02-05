'use client'

import {Role} from '@prisma/client'
import {MoreVerticalIcon} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import deleteMember from '~/actions/delete-member'
import {buttonVariants} from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {convertToTitleCase, parseDate} from '~/utils'

type Member = {
	id: string
	role: Role
	user: {id: string; email: string; createdAt: Date}
}

export default function ExistingMembers({
	teamId,
	members
}: {
	teamId: string
	members: Member[]
}) {
	const router = useRouter()

	async function removeMember(
		teamId: string,
		membershipId: string,
		memberUserId: string,
		memberEmail: string
	) {
		const state = await deleteMember(
			teamId,
			membershipId,
			memberUserId,
			memberEmail
		)
		if (state?.type === 'success') {
			toast.success(state?.message)
			router.refresh()
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}
	return (
		<div className='flex flex-col gap-2'>
			<p className='text-xl'>Existing members</p>
			<div className='rounded-md border'>
				<div className='border-border grid grid-cols-6 border-b px-4 py-1 text-sm'>
					<p className='col-span-3'>Email</p>
					<p>Role</p>
					<p>Member since</p>
					<p></p>
				</div>
				{members.map((member, index) => (
					<div
						key={member.user.email}
						className={`border-border grid grid-cols-6 items-center rounded-sm ${index !== members.length - 1 && 'border-b'} p-4`}>
						<p className='col-span-3'>{member.user.email}</p>
						<p>{convertToTitleCase(member.role)}</p>
						<p>{parseDate(member.user.createdAt)}</p>
						<div className='flex justify-center'>
							<DropdownMenu>
								<DropdownMenuTrigger
									className={`border-none focus-visible:outline-none ${buttonVariants({variant: 'outline', size: 'icon'})}`}>
									<MoreVerticalIcon className='h-4 w-4' />
								</DropdownMenuTrigger>
								<DropdownMenuPortal>
									<DropdownMenuContent className='w-fit -translate-x-[40%]'>
										<DropdownMenuItem
											onClick={() =>
												removeMember(teamId, member.id, member.user.id, member.user.email)
											}>
											Remove member
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenuPortal>
							</DropdownMenu>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
