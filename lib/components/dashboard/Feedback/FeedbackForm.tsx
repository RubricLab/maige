'use client'
import {useRouter} from 'next/navigation'
import {Dispatch, SetStateAction, useEffect} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import {toast} from 'sonner'
import submitFeedback from '~/actions/submit-feedback'
import {Button} from '~/components/ui/button'
import {Textarea} from '~/components/ui/textarea'

const initialState = {
	type: null,
	message: null
}

function SubmitButton() {
	const {pending} = useFormStatus()

	// Add loading state
	useEffect(() => {
		if (pending) toast.loading('Creating...')
	}, [pending])

	return (
		<div className='flex w-full items-center justify-end gap-4'>
			<Button
				type='submit'
				className='w-fit'
				disabled={pending}>
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
	const router = useRouter()
	const [state, formAction] = useFormState(submitFeedback, initialState)

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') {
			toast.success(state?.message)
			setTimeout(() => setDialogOpen(false), 2000)
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}, [state])

	return (
		<form
			className='flex w-full flex-col gap-4'
			action={formAction}>
			<h3>Submit feedback</h3>
			<Textarea
				name='content'
				contentEditable
				maxLength={300}
				className='h-32 max-h-48'
				placeholder='I wish that ...'
			/>
			<SubmitButton />
		</form>
	)
}
