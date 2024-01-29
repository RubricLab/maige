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
				<Button className='border-tertiary hover:border-secondary relative flex h-36 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border !border-dashed bg-transparent p-4 px-20 py-3.5 transition-opacity duration-300'>
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
