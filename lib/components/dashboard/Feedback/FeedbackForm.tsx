'use client'

import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import createFeedback from '~/actions/create-feedback'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'

const initialState = {
	type: '',
	message: ''
}

function SubmitButton() {
	const { pending } = useFormStatus()
	return (
		<div className="flex w-full items-center justify-end gap-4">
			<Button type="submit" className="w-fit" disabled={pending}>
				Submit
			</Button>
		</div>
	)
}

export default function FeedbackForm({
	setDialogOpen
}: {
	setDialogOpen: Dispatch<SetStateAction<boolean>>
}) {
	const [state, formAction] = useFormState(createFeedback, initialState)

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') {
			toast.success(state?.message)
			setDialogOpen(false)
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}, [setDialogOpen, state])

	return (
		<form className="flex w-full flex-col gap-4" action={formAction}>
			<h3>Submit feedback</h3>
			<Textarea
				name="content"
				contentEditable
				maxLength={300}
				minLength={10}
				className="h-32 max-h-48"
				placeholder="I wish that ..."
			/>
			<SubmitButton />
		</form>
	)
}
