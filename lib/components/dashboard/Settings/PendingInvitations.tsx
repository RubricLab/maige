'use client'

import {Role} from '@prisma/client'
import {MoreVerticalIcon} from 'lucide-react'
import {buttonVariants} from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
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
				<div className='border-border grid grid-cols-6 border-b px-4 py-1 text-sm'>
					<p className='col-span-3'>Email</p>
					<p>Role</p>
					<p>Invited at</p>
					<p></p>
				</div>
				{invites.map(i => (
					<div
						key={i.email}
						className='border-border grid grid-cols-6 items-center rounded-sm border-b p-4'>
						<p className='col-span-3'>{i.email}</p>
						<p>{convertToTitleCase(i.role)}</p>
						<p>{parseDate(i.createdAt)}</p>
						<div className='flex justify-center'>
							<DropdownMenu>
								<DropdownMenuTrigger
									className={`border-none focus-visible:outline-none ${buttonVariants({variant: 'outline', size: 'icon'})}`}>
									<MoreVerticalIcon className='h-4 w-4' />
								</DropdownMenuTrigger>
								<DropdownMenuPortal>
									<DropdownMenuContent className='w-fit -translate-x-[40%]'>
										<DropdownMenuItem onClick={() => {}}>Cancel invite</DropdownMenuItem>
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
