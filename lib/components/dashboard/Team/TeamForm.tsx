'use client'
import {useEffect, useRef} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import {toast} from 'sonner'
import createTeam from '~/actions/team'
import {Button} from '~/components/ui/button'
import {Input} from '~/components/ui/input'

const initialState = {
	type: null,
	message: null
}

function CreateButton() {
	const {pending} = useFormStatus()

	// Add loading state
	useEffect(() => {
		if (pending) toast.loading('Creating...')
	}, [pending])

	return (
		<Button
			type='submit'
			disabled={pending}>
			Create
		</Button>
	)
}

export default function TeamForm() {
	const formRef = useRef(null)
	const [state, formAction] = useFormState(createTeam, initialState)

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') {
			toast.success(state?.message)
			setTimeout(() => formRef.current.reset(), 2 * 1000) // Reset form state
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}, [state])

	return (
		<form
			ref={formRef}
			className='flex w-full flex-col justify-end gap-3'
			action={formAction}>
			<Input
				type='text'
				name='name'
				placeholder='Enter name...'
				required
			/>
			<CreateButton />
		</form>
	)
}
