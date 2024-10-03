import { headers } from 'next/headers'
import type Stripe from 'stripe'
import env from '~/env'
import prisma from '~/prisma'
import { stripe } from '~/stripe'

/**
 * POST /api/webhook/stripe
 *
 * Stripe webhook handler
 */
export const POST = async (req: Request) => {
	const payload = await req.text()

	const headersList = headers()
	const signature = headersList.get('stripe-signature') || ''

	if (!signature) return Response.json({ message: 'No signature' }, { status: 400 })

	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET || '')
	} catch (error) {
		console.error('Bad Stripe webhook secret')
		return Response.json(
			{
				message: 'Stripe webhook secret error'
			},
			{ status: 400 }
		)
	}

	const {
		type: eventType,
		data: { object }
	} = event

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const { customer } = object as any

	if (eventType === 'checkout.session.completed') {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const { client_reference_id: customerId, subscription } = object as any

		if (!customerId)
			return Response.json(
				{ message: 'Stripe checkout session missing customer ID in webhook' },
				{ status: 400 }
			)

		await prisma.user.update({
			where: {
				id: customerId
			},
			data: {
				stripeCustomerId: customer,
				stripeSubscriptionId: subscription || null,
				usageLimit: 1000
			}
		})
	} else if (eventType === 'customer.subscription.created') {
		/**
		 * Customer created
		 */

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const subscriptionItem = (object as any).items.data.find(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(item: any) => item.object === 'subscription_item'
		)

		if (!subscriptionItem)
			return Response.json(
				{
					message: 'Could not find Stripe subscription item'
				},
				{ status: 400 }
			)

		try {
			await prisma.user.update({
				where: {
					stripeCustomerId: customer
				},
				data: {
					stripeSubscriptionId: subscriptionItem.id
				}
			})
		} catch (error) {
			return Response.json({
				message: 'No customer to connect in DB'
			})
		}
	} else if (eventType === 'customer.subscription.deleted')
		/**
		 * Customer deleted
		 */
		try {
			await prisma.user.delete({
				where: {
					stripeCustomerId: customer
				}
			})
		} catch {
			return Response.json({
				message: 'No customer to delete in DB'
			})
		}
	else if (eventType === 'customer.subscription.updated') {
		/**
		 * Customer updated
		 */

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const subscriptionItem = (object as any).items.data.find(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(item: any) => item.object === 'subscription_item'
		)

		if (!subscriptionItem)
			return Response.json(
				{
					message: 'Could not find Stripe subscription item'
				},
				{ status: 400 }
			)

		try {
			await prisma.user.update({
				where: {
					stripeCustomerId: customer
				},
				data: {
					stripeSubscriptionId: subscriptionItem.id
				}
			})
		} catch (error) {
			return Response.json({
				message: 'No customer to update in DB'
			})
		}
	} else console.log(`Unhandled Stripe webhook event type: ${eventType}`)

	return Response.json({
		message: 'Stripe webhook received'
	})
}
