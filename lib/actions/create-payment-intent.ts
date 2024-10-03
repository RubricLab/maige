'use server'

import { stripe } from '~/stripe'
import { createPaymentLink } from '~/utils/payment'
import { getCurrentUser } from '~/utils/session'

export async function createPaymentIntent(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	_prevState: any,
	_formData: FormData
) {
	const user = await getCurrentUser()
	if (!user)
		return {
			message: 'Unauthorized, no session',
			type: 'error',
			data: null
		}

	const url = await createPaymentLink(stripe, user.id)

	if (!url)
		return {
			message: 'Failed to create payment link',
			type: 'error',
			data: null
		}

	return {
		type: 'success',
		message: 'Payment link created. Redirecting...',
		data: { url }
	}
}
