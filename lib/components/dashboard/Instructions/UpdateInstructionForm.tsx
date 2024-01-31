'use client'
import {Instruction} from '@prisma/client'
import {useRouter} from 'next/navigation'
import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import {toast} from 'sonner'
import {updateInstruction} from '~/actions/update-instruction'
import {Button} from '~/components/ui/button'
import {Input} from '~/components/ui/input'
import {Textarea} from '~/components/ui/textarea'

const initialState = {
	type: null,
	message: null
}

function SubmitButton() {
	const {pending} = useFormStatus()
	return (
		<div className='flex w-full items-center justify-end gap-4'>
			<Button
				type='submit'
				className='w-fit'
				disabled={pending}>
				Update
			</Button>
		</div>
	)
}

export default function UpdateInstructionForm({
	instruction,
	setDialogOpen
}: {
	instruction: Instruction
	setDialogOpen: Dispatch<SetStateAction<boolean>>
}) {
	const router = useRouter()
	const [state, formAction] = useFormState(updateInstruction, initialState)
	const [content, setContent] = useState(instruction.content ?? '')

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') {
			toast.success(state?.message)
			setDialogOpen(false)
			router.refresh()
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}, [state])

	return (
		<form
			className='flex w-full flex-col gap-4'
			action={formAction}>
			<h3>Update instruction</h3>
			<Input
				name='instructionId'
				type='hidden'
				value={instruction.id}
			/>
			<Textarea
				name='content'
				value={content}
				onChange={e => setContent(e.target.value)}
				contentEditable
				maxLength={300}
				minLength={10}
				className='h-32 max-h-48'
				placeholder='Maige ...'
			/>
			<SubmitButton />
		</form>
	)
}
