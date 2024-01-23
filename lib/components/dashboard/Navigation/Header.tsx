'use client'

import {Session} from 'next-auth'
import {signOut} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {CommandMenu} from '~/components/CommandBar'
import Feedback from '~/components/Feedback'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import MaigeLogo from '../../../../public/logo.png'
import ProjectRoute from './projectHeader'

export function DashboardHeader({
	session,
	avatarUrl
}: {
	session: Session
	avatarUrl: string
}) {
	const pathname = usePathname()

	return (
		<div className='sticky top-0 z-50 flex w-full select-none flex-row items-center justify-between pb-5 pt-4 backdrop-blur-sm'>
			<div className='flex items-center gap-4'>
				<Image
					src={MaigeLogo}
					width={35}
					height={35}
					className='rounded-full object-cover'
					alt='Maige Logo'
				/>
				<span className='inline-flex items-center justify-center gap-1.5'>
					<Link
						href={'/dashboard'}
						className='rounded-sm px-2.5 py-0.5 hover:bg-primary/10'>
						{session.user.name}
					</Link>
					{pathname.split('/dashboard/repo/')[1] && (
						<>
							<span className='text-xl text-accent'>/</span>{' '}
							<Link
								className='rounded-sm px-2.5 py-0.5 hover:bg-primary/10'
								href={
									'/dashboard/repo/' +
									pathname.split('/dashboard/repo/')[1].split('/')[0]
								}>
								<ProjectRoute
									projectId={pathname.split('/dashboard/repo/')[1].split('/')[0]}
								/>
							</Link>
						</>
					)}
				</span>
			</div>
			<div className='flex items-center gap-4'>
				<Feedback />
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
						{session.user.email && (
							<>
								<DropdownMenuItem disabled={true}></DropdownMenuItem>
								<DropdownMenuSeparator />
							</>
						)}
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
