import type Stripe from 'stripe'
import { STRIPE } from '~/constants'
import env from '~/env'
import prisma from '~/prisma'

const TIERS = {
	base: {
		usageLimit: 30,
		priceId: env.STRIPE_BASE_PRICE_ID
	}
}

type Tier = keyof typeof TIERS

/**
 * Increment usage count for a project
 */
export async function incrementUsage(projectId: string) {
	await prisma.project.update({
		where: {
			id: projectId
		},
		data: {
			totalUsage: {
				increment: 1
			},
			usageUpdatedAt: new Date()
		}
	})
}

/**
 * To re-use payment links in other places eg. welcome emails
 */
export const createPaymentLink = async (
	stripe: Stripe,
	customerId: string,
	tier: Tier = 'base',
	email = ''
): Promise<string | undefined> => {
	try {
		const stripeSession = await stripe.checkout.sessions.create({
			client_reference_id: customerId,
			...(email && { customer_email: email }),
			mode: 'subscription',
			payment_method_types: ['card'],
			success_url: env.NEXTAUTH_URL,
			cancel_url: env.NEXTAUTH_URL,
			line_items: [
				{
					price: TIERS[tier].priceId,
					quantity: 1
				}
			],
			automatic_tax: {
				enabled: true
			},
			tax_id_collection: {
				enabled: true
			}
		})

		if (!stripeSession?.url) throw new Error('Failed to create Stripe session')

		return stripeSession.url
	} catch (err) {
		console.warn('Error creating payment link: ', err)
		return STRIPE.PAYMENT_LINK
	}
}
