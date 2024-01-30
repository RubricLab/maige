'use client'

import {Project, Team, User} from '@prisma/client'
import {signOut} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {CommandMenu} from '~/components/CommandBar'
import {Maige} from '~/components/logos'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import FeedbackDialog from '../Feedback/FeedbackDialog'
import TeamNav from './TeamNav'

export default function DashboardHeader({
	user,
	teams,
	projects
}: {
	user: User
	teams: Team[]
	projects: Project[]
}) {
	const pathname = usePathname()
	const router = useRouter()

	return (
		<div className='sticky top-0 z-50 flex w-full select-none flex-row items-center justify-between pb-5 pt-4 backdrop-blur-sm'>
			<div className='flex items-center gap-4'>
				<Link
					href='/'
					className='group'>
					<Maige className='group-hover:text-secondary text-tertiary h-8 transition-colors' />
				</Link>
				<span className='inline-flex items-center justify-center gap-1.5'>
					<TeamNav
						teams={teams}
						slug={pathname.split('/')[1]}
					/>
				</span>
			</div>
			<div className='flex items-center gap-4'>
				<FeedbackDialog />
				<CommandMenu projects={projects} />
				<DropdownMenu>
					<DropdownMenuTrigger className='focus-visible:outline-none'>
						<Image
							src={user.image}
							width={35}
							height={35}
							className='rounded-full object-cover'
							alt='User avatar'
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='mr-6 mt-2 w-[235px]'>
						{(user.name || user.email) && (
							<>
								<DropdownMenuItem disabled={true}>
									{user.name ? user.name : user.email}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
							</>
						)}
						<DropdownMenuItem
							onClick={() => router.push('/home')}
							className='cursor-pointer'>
							Landing Page
						</DropdownMenuItem>
						<DropdownMenuItem
							className='cursor-pointer'
							onClick={() => signOut()}>
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}
