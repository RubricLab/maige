'use server'

import {stripe} from '~/stripe'
import {createPaymentLink} from '~/utils/payment'
import {getCurrentUser} from '~/utils/session'

export async function createPaymentIntent(_: any, formData: FormData) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error'
		}

	const url = await createPaymentLink(stripe, user.id)

	if (!url)
		return {
			message: 'Failed to create payment link',
			type: 'error'
		}

	return {
		type: 'success',
		message: 'Payment link created. Redirecting...',
		data: {url}
	}
}
