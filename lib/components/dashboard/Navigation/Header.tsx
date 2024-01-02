'use client'

import {Session} from 'next-auth'
import {signOut} from 'next-auth/react'
import Image from 'next/image'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import MaigeLogo from '../../../../public/logo.png'

export function DashboardHeader({
	session,
	avatarUrl
}: {
	session: Session
	avatarUrl: string
}) {
	return (
		<div className='sticky top-0 flex w-full select-none flex-row items-center justify-between pb-10 pt-4'>
			<Image
				src={MaigeLogo}
				width={40}
				height={40}
				className='rounded-full object-cover'
				alt='Maige Logo'
			/>
			<DropdownMenu>
				<DropdownMenuTrigger className='focus-visible:outline-none'>
					<Image
						src={avatarUrl}
						width={40}
						height={40}
						className='rounded-full object-cover'
						alt='User avatar'
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='mr-6 mt-2 w-[235px]'>
					<DropdownMenuItem disabled={true}>{session.user.email}</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => signOut()}>
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
