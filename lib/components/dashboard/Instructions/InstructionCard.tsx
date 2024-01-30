'use client'

import {Instruction} from '@prisma/client'
import {Dialog, DialogTrigger} from '@radix-ui/react-dialog'
import {DropdownMenuPortal} from '@radix-ui/react-dropdown-menu'
import {MoreVerticalIcon} from 'lucide-react'
import {useState} from 'react'
import deleteInstruction from '~/actions/delete-instruction'
import {buttonVariants} from '~/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import UpdateInstruction from './UpdateInstruction'

export default function InstructionCard({
	instruction,
	teamSlug
}: {
	instruction: Instruction
	teamSlug: string
}) {
	const [dialogOpen, setDialogOpen] = useState(false)
	return (
		<div className='border-border flex min-h-36 flex-col justify-between gap-3 rounded-sm border p-3'>
			<div>
				<p>{instruction.content}</p>
			</div>
			<div className='flex items-center justify-between'>
				<span className='text-tertiary text-sm'>
					Created by @{instruction.creatorUsername}
				</span>
				<Dialog
					open={dialogOpen}
					onOpenChange={() => setDialogOpen(prev => !prev)}>
					<DropdownMenu>
						<DropdownMenuTrigger
							className={`border-none focus-visible:outline-none ${buttonVariants({variant: 'outline', size: 'icon'})}`}>
							<MoreVerticalIcon className='h-4 w-4' />
						</DropdownMenuTrigger>
						<DropdownMenuPortal>
							<DropdownMenuContent className='w-fit -translate-x-[40%]'>
								<DialogTrigger className='w-full'>
									<DropdownMenuItem>Edit</DropdownMenuItem>
								</DialogTrigger>
								<DropdownMenuItem
									onClick={() => deleteInstruction(teamSlug, instruction)}>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenuPortal>
					</DropdownMenu>
					<UpdateInstruction
						instruction={instruction}
						setDialogOpen={setDialogOpen}
					/>
				</Dialog>
			</div>
		</div>
	)
}
