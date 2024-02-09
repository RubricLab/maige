'use client'

import {Project} from '@prisma/client'
import {ChevronsUpDown, PlusIcon} from 'lucide-react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {Dispatch, SetStateAction, useState} from 'react'
import createProjectIntent from '~/actions/create-project-intent'
import {Button} from '~/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem
} from '~/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover'
import {GITHUB} from '~/constants'
import env from '~/env.mjs'
import {getProjectUrl} from '~/utils'

function AddProject({
	setOpen,
	teamSlug
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
	teamSlug: string
}) {
	const formData = new FormData()
	formData.append('teamSlug', teamSlug)

	const handleClick = async () => {
		const res = await createProjectIntent(null, formData)
		if (res?.type === 'success') {
			window.open(
				`${GITHUB.BASE_URL}/apps/${env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`
			)
			setOpen(false)
			return
		}
	}

	return (
		<CommandItem
			className='flex h-full w-full items-center justify-between'
			onSelect={handleClick}>
			Add project <PlusIcon className='h-4 w-4' />
		</CommandItem>
	)
}

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
						className='group w-5 border-none hover:border'>
						<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50 transition-opacity duration-100 group-hover:opacity-100' />
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
							<AddProject
								setOpen={setOpen}
								teamSlug={teamSlug}
							/>
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
