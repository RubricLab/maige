'use client'

import {Team} from '@prisma/client'
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
import CreateTeam from '../Team/CreateTeam'

export default function TeamSelect({
	teams,
	teamSlug
}: {
	teams: Team[]
	teamSlug: string
}) {
	const [open, setOpen] = useState(false)
	const router = useRouter()

	return (
		<div className='flex items-center gap-1'>
			<Link href={`/${teamSlug}`}>
				{teams.find(team => team.slug === teamSlug)?.name}
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
						<CommandInput placeholder='Search team...' />
						<CommandEmpty>No team found.</CommandEmpty>
						<CommandGroup>
							{teams.map(team => (
								<CommandItem
									key={team.id}
									value={team.name}
									onSelect={() => router.push(`/${team.slug}`)}
									className='flex w-full items-center justify-between'>
									<p className='truncate'>{team.name}</p>
								</CommandItem>
							))}
							<CreateTeam />
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
