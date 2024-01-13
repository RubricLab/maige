import {CommandIcon, Search as SearchIcon} from 'lucide-react'
import React from 'react'

import {Button} from '~/components/ui/button'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '~/components/ui/command'

export function CommandMenu() {
	const [open, setOpen] = React.useState(false)

	React.useEffect(() => {
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
				className='w-full pl-4 pr-2 text-zinc-300 hover:bg-zinc-900 md:w-80'>
				<div className='flex h-10 flex-row justify-between'>
					<div className='flex flex-row gap-2'>
						<SearchIcon className='my-auto h-4 w-4' />
						Search...
					</div>
					<kbd className='hidden items-center gap-1 px-[0.2rem] py-[0.2rem] font-mono sm:inline-flex'>
						<span className='flex h-[25px] w-[25px] items-center justify-center rounded bg-zinc-800'>
							<CommandIcon width={12} />
						</span>{' '}
						<span className='flex h-[25px] w-[25px] items-center justify-center rounded bg-zinc-800 text-sm'>
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
					<CommandGroup heading='Suggestions'>
						<CommandItem>Coming soon...</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	)
}
