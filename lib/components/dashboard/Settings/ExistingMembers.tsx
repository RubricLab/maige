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
										<DropdownMenuItem onClick={() => {}}>Delete member</DropdownMenuItem>
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
