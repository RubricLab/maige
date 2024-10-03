import { stripe } from '~/stripe'
import { createPaymentLink } from '~/utils/payment'

/**
 * Generate a Stripe payment URL for a customer.
 */
export const POST = async (req: Request) => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const { tier, email, customerId } = (await req.json()) as any

	if (!customerId)
		return Response.json(
			{
				message: 'Missing customer ID'
			},
			{ status: 400 }
		)

	try {
		const url = await createPaymentLink(stripe, customerId, tier, email)

		return Response.json({
			url
		})
	} catch {
		return Response.json(
			{
				message: 'Failed to create Stripe session'
			},
			{ status: 500 }
		)
	}
}
