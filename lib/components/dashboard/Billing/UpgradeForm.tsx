'use client'

import {useEffect} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import {toast} from 'sonner'
import {createPaymentIntent} from '~/actions/create-payment-intent'
import {Button} from '~/components/ui/button'

const initialState = {
	type: null,
	message: null
}

function UpgradeButton() {
	const {pending} = useFormStatus()

	return (
		<Button
			className='w-fit'
			type='submit'
			disabled={pending}
			variant='outline'>
			Upgrade to Pro
		</Button>
	)
}

export function UpgradeForm() {
	const [state, formAction] = useFormState(createPaymentIntent, initialState)

	useEffect(() => {
		if (state?.type === 'success') {
			toast(state.message)
			window.open(state?.data?.url)
		} else if (state?.type === 'error') toast.error(state?.message)
	}, [state])

	return (
		<form
			action={f => {
				toast('Creating payment link...')
				formAction(f)
			}}>
			<UpgradeButton />
		</form>
	)
}
