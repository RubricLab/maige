'use client'

import {Project} from '@prisma/client'
import {ChevronsUpDown} from 'lucide-react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {Button} from '~/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem
} from '~/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover'
import {getProjectUrl} from '~/utils'

export default function ProjectSelect({
	projects,
	teamSlug,
	projectId
}: {
	projects: Project[]
	teamSlug: string
	projectId: string
}) {
	const [open, setOpen] = useState(false)
	const router = useRouter()

	return (
		<div className='flex items-center gap-1'>
			<Link href={getProjectUrl(teamSlug, projectId)}>
				{projects.find(p => p.id === projectId)?.name}
			</Link>
			<Popover
				open={open}
				onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						size='icon'
						role='combobox'
						aria-expanded={open}
						className='border-none hover:border'>
						<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[200px] translate-x-[82px] p-0'>
					<Command>
						<CommandInput placeholder='Search project...' />
						<CommandEmpty>No project found.</CommandEmpty>
						<CommandGroup>
							{projects.map(p => (
								<CommandItem
									key={p.id}
									value={p.name}
									onSelect={() => {
										router.push(getProjectUrl(teamSlug, p.id))
										setOpen(false)
									}}>
									<p className='truncate'>{p.name}</p>
								</CommandItem>
							))}
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
