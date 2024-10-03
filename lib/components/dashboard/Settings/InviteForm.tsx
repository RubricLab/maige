'use client'

import { Role } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import createInvitation from '~/actions/create-invitation'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { convertToTitleCase } from '~/utils'

const initialState = {
	type: '',
	message: ''
}

function InviteButton() {
	const { pending } = useFormStatus()
	return (
		<div className="flex w-full items-center justify-end gap-4">
			<Button type="submit" className="w-fit" disabled={pending}>
				Invite
			</Button>
		</div>
	)
}

export default function InviteForm({
	teamId,
	setDialogOpen
}: {
	teamId: string
	setDialogOpen: Dispatch<SetStateAction<boolean>>
}) {
	const router = useRouter()
	const [state, formAction] = useFormState(createInvitation, initialState)

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
	}, [setDialogOpen, state, router])

	return (
		<form className="flex w-full flex-col gap-4" action={formAction}>
			<h3>Invite member</h3>
			<Input name="email" type="email" required placeholder="Email" />
			<Input name="teamId" type="hidden" value={teamId} />
			<Select name="role" required>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Role" />
				</SelectTrigger>
				<SelectContent>
					{(Object.keys(Role) as (keyof typeof Role)[]).map(role => (
						<SelectItem key={role} value={role}>
							{convertToTitleCase(role)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<InviteButton />
		</form>
	)
}
