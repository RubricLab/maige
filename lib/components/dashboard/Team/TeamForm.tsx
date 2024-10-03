'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import createTeam from '~/actions/create-team'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const initialState = {
	type: '',
	message: '',
	data: {
		slug: ''
	}
}

function CreateButton() {
	const { pending } = useFormStatus()

	// Add loading state
	useEffect(() => {
		if (pending) toast.loading('Creating...')
	}, [pending])

	return (
		<div className="flex w-full items-center justify-end">
			<Button type="submit" disabled={pending}>
				Create
			</Button>
		</div>
	)
}

export default function TeamForm() {
	const router = useRouter()
	const [state, formAction] = useFormState(createTeam, initialState)

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') {
			toast.success(state?.message)
			if (state?.data?.slug) setTimeout(() => router.push(`/${state.data.slug}`), 1 * 1000)
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}, [router, state])

	return (
		<form className="flex w-full flex-col justify-end gap-3" action={formAction}>
			<Input type="text" name="name" placeholder="Enter name..." required />
			<CreateButton />
		</form>
	)
}
