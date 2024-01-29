'use client'

import {PlusIcon} from 'lucide-react'
import {useState} from 'react'
import {Button} from '~/components/ui/button'
import {Dialog, DialogContent, DialogTrigger} from '~/components/ui/dialog'
import InstructionForm from './InstructionForm'

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
				<Button className='w-fit '>
					<PlusIcon />
					Add instruction
				</Button>
			</DialogTrigger>
			<DialogContent>
				<InstructionForm
					projectId={projectId}
					setDialogOpen={setOpen}
				/>
			</DialogContent>
		</Dialog>
	)
}
