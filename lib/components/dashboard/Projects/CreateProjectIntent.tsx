'use client'

import { PlusIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import createProjectIntent from '~/actions/create-project-intent'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { GITHUB } from '~/constants'
import env from '~/env'

const initialState = {
	type: '',
	message: ''
}

function AddButton() {
	const { pending } = useFormStatus()

	return (
		<Button
			type="submit"
			className="!border-dashed relative flex h-full min-h-36 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-tertiary bg-transparent p-4 py-3.5 text-base transition-all hover:border-secondary"
			disabled={pending}
		>
			<PlusIcon />
			Add project
		</Button>
	)
}

export default function CreateProjectIntent({ teamSlug }: { teamSlug: string }) {
	const [state, formAction] = useFormState(createProjectIntent, initialState)

	// Handle response
	useEffect(() => {
		if (state?.type === 'success')
			window.open(
				`${GITHUB.BASE_URL}/apps/${env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`,
				'_self'
			)
		else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}, [state])

	return (
		<form className="flex w-full flex-col justify-end gap-3" action={formAction}>
			<Input type="hidden" name="teamSlug" value={teamSlug} />
			<AddButton />
		</form>
	)
}
