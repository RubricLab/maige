'use client'

import {Team} from '@prisma/client'
import {Check, ChevronsUpDown} from 'lucide-react'
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
import {cn} from '~/utils'

const teams = [{id: '', slug: 'next.js', name: 'Next.js'}]

export default function TeamNav({teams, slug}: {teams: Team[]; slug: string}) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState('')

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-[200px] justify-between'>
					{value
						? teams.find(team => team.id === value).name
						: teams.find(team => team.slug === slug).name}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput placeholder='Search team...' />
					<CommandEmpty>No team found.</CommandEmpty>
					<CommandGroup>
						{teams.map(team => (
							<CommandItem
								key={team.id}
								value={team.id}
								onSelect={currentValue => {
									setValue(currentValue === value ? '' : currentValue)
									setOpen(false)
								}}>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										value === team.id ? 'opacity-100' : 'opacity-0'
									)}
								/>
								{team.name}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
