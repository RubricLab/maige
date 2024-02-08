'use client'

import {Instruction} from '@prisma/client'
import {Dialog, DialogTrigger} from '@radix-ui/react-dialog'
import {DropdownMenuPortal} from '@radix-ui/react-dropdown-menu'
import {MoreVerticalIcon} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {toast} from 'sonner'
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
	instruction
}: {
	instruction: Instruction
}) {
	const router = useRouter()
	const [dialogOpen, setDialogOpen] = useState(false)

	async function handleDelete(instructionId: string) {
		const state = await deleteInstruction(instructionId)
		if (state?.type === 'success') {
			toast.success(state?.message)
			router.refresh()
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}
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
								<DropdownMenuItem onClick={() => handleDelete(instruction.id)}>
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
