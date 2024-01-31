import {Instruction} from '@prisma/client'
import {Dispatch, SetStateAction} from 'react'
import {
	DialogContent,
	DialogOverlay,
	DialogPortal
} from '~/components/ui/dialog'
import UpdateInstructionForm from './UpdateInstructionForm'

export default function UpdateInstruction({
	instruction,
	setDialogOpen
}: {
	instruction: Instruction
	setDialogOpen: Dispatch<SetStateAction<boolean>>
}) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogContent>
				<UpdateInstructionForm
					instruction={instruction}
					setDialogOpen={setDialogOpen}
				/>
			</DialogContent>
		</DialogPortal>
	)
}
