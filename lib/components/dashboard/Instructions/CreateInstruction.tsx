'use client'

import {PlusIcon} from 'lucide-react'
import {useState} from 'react'
import {Button} from '~/components/ui/button'
import {Dialog, DialogContent, DialogTrigger} from '~/components/ui/dialog'
import CreateInstructionForm from './CreateInstructionForm'

type Props = {
	projectId: string
}

export default function CreateInstruction({projectId}: Props) {
	const [open, setOpen] = useState(false)

	return (
		<Dialog
			open={open}
			onOpenChange={() => setOpen(prev => !prev)}>
			<DialogTrigger>
				<Button
					type='submit'
					className='border-tertiary hover:border-secondary h-full min-h-36 w-full rounded-sm border !border-dashed bg-transparent text-base transition-opacity duration-300'>
					<PlusIcon />
					Add instruction
				</Button>
			</DialogTrigger>
			<DialogContent>
				<CreateInstructionForm
					projectId={projectId}
					setDialogOpen={setOpen}
				/>
			</DialogContent>
		</Dialog>
	)
}
