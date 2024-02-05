'use client'

import {Role} from '@prisma/client'
import {MoreVerticalIcon} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import deleteInvitation from '~/actions/delete-invitation'
import {buttonVariants} from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {convertToTitleCase, copyToClipboard, parseDate} from '~/utils'

type Invite = {
	id: string
	createdAt: Date
	role: Role
	email: string
}

export default function PendingInvitations({invites}: {invites: Invite[]}) {
	const router = useRouter()

	async function cancelInvitation(id: string, email: string) {
		const state = await deleteInvitation(id, email)
		if (state?.type === 'success') {
			toast.success(state?.message)
			router.refresh()
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}

	function copyInviteLink(id: string) {
		const url = window.location.origin + '/invite/' + id
		copyToClipboard(url)
		toast.success('Copied link to clipboard')
	}

	return (
		<div className='flex flex-col gap-2'>
			<p className='text-xl'>Pending invites</p>
			<div className='rounded-md border'>
				<div className='border-border grid grid-cols-6 border-b px-4 py-1 text-sm'>
					<p className='col-span-3'>Email</p>
					<p>Role</p>
					<p>Invited at</p>
					<p></p>
				</div>
				{invites.map((invite, index) => (
					<div
						key={invite.email}
						className={`border-border grid grid-cols-6 items-center rounded-sm ${index !== invites.length - 1 && 'border-b'}  p-4`}>
						<p className='col-span-3'>{invite.email}</p>
						<p>{convertToTitleCase(invite.role)}</p>
						<p>{parseDate(invite.createdAt)}</p>
						<div className='flex justify-center'>
							<DropdownMenu>
								<DropdownMenuTrigger
									className={`border-none focus-visible:outline-none ${buttonVariants({variant: 'outline', size: 'icon'})}`}>
									<MoreVerticalIcon className='h-4 w-4' />
								</DropdownMenuTrigger>
								<DropdownMenuPortal>
									<DropdownMenuContent className='w-fit -translate-x-[40%]'>
										<DropdownMenuItem onClick={() => copyInviteLink(invite.id)}>
											Copy invite link
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => cancelInvitation(invite.id, invite.email)}>
											Cancel invite
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
