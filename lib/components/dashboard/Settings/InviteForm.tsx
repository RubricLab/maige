'use client'

import {useRouter} from 'next/navigation'
import {Dispatch, SetStateAction, useEffect} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import {toast} from 'sonner'
import createInvitation from '~/actions/create-invitation'
import {Button} from '~/components/ui/button'
import {Input} from '~/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'

const initialState = {
	type: null,
	message: null
}

function InviteButton() {
	const {pending} = useFormStatus()
	return (
		<div className='flex w-full items-center justify-end gap-4'>
			<Button
				type='submit'
				className='w-fit'
				disabled={pending}>
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
		<form
			className='flex w-full flex-col gap-4'
			action={formAction}>
			<h3>Invite member</h3>
			<Input
				name='email'
				type='email'
				placeholder='Email'
			/>
			<Input
				name='teamId'
				type='hidden'
				value={teamId}
			/>
			<Select name='role'>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Role' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='ADMIN'>Admin</SelectItem>
					<SelectItem value='USER'>User</SelectItem>
				</SelectContent>
			</Select>
			<InviteButton />
		</form>
	)
}
