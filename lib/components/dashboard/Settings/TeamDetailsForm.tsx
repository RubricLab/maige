'use client'

import type { Team } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { updateTeamDetails } from '~/actions/update-team-details'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const initialState = {
	type: '',
	message: ''
}

function UpdateButton() {
	const { pending } = useFormStatus()
	return (
		<div className="flex w-full items-center justify-end gap-4">
			<Button type="submit" className="w-fit" disabled={pending}>
				Save
			</Button>
		</div>
	)
}

export default function TeamDetailsForm({ team }: { team: Team }) {
	const router = useRouter()
	const [state, formAction] = useFormState(updateTeamDetails, initialState)
	const [name, setName] = useState<string>(team.name as string)

	// Trigger toast when state changes
	useEffect(() => {
		if (state?.type === 'success') {
			toast.success(state?.message)
			router.refresh()
		} else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}, [state, router])

	return (
		<form className="flex w-full max-w-sm flex-col gap-4" action={formAction}>
			<div className="grid grid-cols-4 items-center">
				<p className="text-secondary text-sm">Team name</p>
				<Input
					className="col-span-3"
					name="name"
					type="text"
					required
					onChange={e => setName(e.target.value)}
					value={name}
					placeholder="Name"
				/>
			</div>
			<div className="grid grid-cols-4 items-center">
				<p className="text-secondary text-sm">Team slug</p>
				<Input
					className="col-span-3"
					name="slug"
					type="text"
					disabled
					placeholder="Slug"
					value={team.slug}
				/>
			</div>
			<Input name="teamId" type="hidden" value={team.id} />
			{/* Render button if there is a change */}
			{team.name !== name && <UpdateButton />}
		</form>
	)
}
