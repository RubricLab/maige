import {Project} from '@prisma/client'
import {CommandIcon, Search as SearchIcon} from 'lucide-react'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {Button} from '~/components/ui/button'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '~/components/ui/command'

type Props = {
	projects: Project[]
}

export function CommandMenu({projects}: Props) {
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const pathname = usePathname()
	const teamSlug = pathname.split('/')[1] ?? ''
	const groups = [
		{
			title: 'Pages',
			actions: [
				{
					name: 'Projects',
					path: `/${teamSlug}`
				},
				{
					name: 'Usage',
					path: `/${teamSlug}/usage`
				},
				{
					name: 'Settings',
					path: `/${teamSlug}/settings/members`
				},

				{
					name: 'Landing Page',
					path: '/home'
				}
			]
		},
		{
			title: 'Projects',
			actions: projects.map(project => ({
				name: project.name,
				path: `/${teamSlug}/project/${project.id}`
			}))
		}
	]

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && e.metaKey) setOpen(open => !open)
		}

		document.addEventListener('keydown', down)

		return () => document.removeEventListener('keydown', down)
	}, [])

	return (
		<>
			<Button
				asChild
				variant='outline'
				onClick={() => setOpen(true)}
				className='w-full pl-4 pr-2 text-gray-300 hover:bg-gray-900 md:w-80'>
				<div className='flex h-10 flex-row justify-between'>
					<div className='flex flex-row gap-2'>
						<SearchIcon className='my-auto h-4 w-4' />
						Search...
					</div>
					<kbd className='hidden items-center gap-1 px-[0.2rem] py-[0.2rem] font-mono sm:inline-flex'>
						<span className='flex h-[25px] w-[25px] items-center justify-center rounded bg-gray-800'>
							<CommandIcon width={12} />
						</span>{' '}
						<span className='flex h-[25px] w-[25px] items-center justify-center rounded bg-gray-800 text-sm'>
							{/* Attempts to center the K */}
							<span className='mt-[0.05rem]'>K</span>
						</span>
					</kbd>
				</div>
			</Button>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}>
				<CommandInput placeholder='Type a command or search...' />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{groups.map(({title, actions}) => (
						<CommandGroup
							heading={title}
							key={title}>
							{actions.map(({name, path}) => (
								<CommandItem
									key={path}
									onSelect={() => {
										router.push(path)
										setOpen(false)
									}}>
									{name}
								</CommandItem>
							))}
						</CommandGroup>
					))}
				</CommandList>
			</CommandDialog>
		</>
	)
}
