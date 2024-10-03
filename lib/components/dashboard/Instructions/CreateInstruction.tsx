'use client'

import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import CreateInstructionForm from './CreateInstructionForm'

type Props = {
	projectId: string
}

export default function CreateInstruction({ projectId }: Props) {
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={() => setOpen(prev => !prev)}>
			<DialogTrigger className="!border-dashed flex h-full min-h-36 w-full items-center justify-center gap-2 rounded-sm border border-tertiary bg-transparent text-base transition-opacity duration-300 hover:border-secondary">
				<PlusIcon />
				Add instruction
			</DialogTrigger>
			<DialogContent>
				<CreateInstructionForm projectId={projectId} setDialogOpen={setOpen} />
			</DialogContent>
		</Dialog>
	)
}
