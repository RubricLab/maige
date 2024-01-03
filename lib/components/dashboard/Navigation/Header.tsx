'use client'

import {Session} from 'next-auth'
import {signOut} from 'next-auth/react'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import {CommandMenu} from '~/components/command-bar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import MaigeLogo from '../../../../public/logo.png'
import ProjectRoute from './projectHeader'
import Link from 'next/link'

export function DashboardHeader({
	session,
	avatarUrl
}: {
	session: Session
	avatarUrl: string
}) {
	const pathname = usePathname()

	return (
		<div className='sticky top-0 flex w-full select-none flex-row items-center justify-between pb-5 pt-4'>
			<div className='flex items-center gap-4'>
				<Image
					src={MaigeLogo}
					width={35}
					height={35}
					className='rounded-full object-cover'
					alt='Maige Logo'
				/>
				<span className='inline-flex items-center gap-1.5'>
					<Link href={"/dashboard"} className='px-2.5 py-0.5 rounded-sm hover:bg-white hover:bg-opacity-20'>{session.user.name}</Link>
					{pathname.split('/dashboard/repo/')[1] && (
						<>
							<span className='mb-1 text-xl text-gray-500'>/</span>{' '}
							<Link className='px-2.5 py-0.5 rounded-sm hover:bg-white hover:bg-opacity-20' href={"/dashboard/repo/" + pathname.split('/dashboard/repo/')[1].split('/')[0]}><ProjectRoute projectId={pathname.split('/dashboard/repo/')[1].split('/')[0]} /></Link>
						</>
					)}
				</span>
			</div>
			<div className='flex items-center gap-4'>
				<CommandMenu />
				<DropdownMenu>
					<DropdownMenuTrigger className='focus-visible:outline-none'>
						<Image
							src={avatarUrl}
							width={35}
							height={35}
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
		</div>
	)
}
