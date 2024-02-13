'use client'

import {Project, Team} from '@prisma/client'
import {User} from 'next-auth'
import {signOut} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {useParams, useRouter} from 'next/navigation'
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
import ProjectSelect from './ProjectSelect'
import TeamSelect from './TeamSelect'

export default function DashboardNavClient({
	user,
	teams,
	projects
}: {
	user: User
	teams: Team[]
	projects: Project[]
}) {
	const params = useParams<{slug: string; projectId: string}>()
	const router = useRouter()
	return (
		<div className='sticky top-0 z-50 flex w-full select-none flex-row items-center justify-between pb-5 pt-4 backdrop-blur-sm'>
			<div className='flex items-center gap-4'>
				<Link
					href='/home'
					className='group'>
					<Maige className='group-hover:text-secondary text-tertiary h-8 transition-colors' />
				</Link>
				<div className='inline-flex items-center justify-center gap-1.5'>
					<TeamSelect
						teams={teams}
						teamSlug={params.slug}
					/>
					{params.projectId && (
						<span className='mb-0.5 select-none px-1 pr-2 text-xl font-light opacity-30'>
							/
						</span>
					)}
					{params.projectId && (
						<ProjectSelect
							projects={projects}
							projectId={params.projectId}
							teamSlug={params.slug}
						/>
					)}
				</div>
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
