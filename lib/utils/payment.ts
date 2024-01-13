import {PrismaClient} from '@prisma/client'
import Stripe from 'stripe'
import {STRIPE, TIERS} from '~/constants'
import env from '~/env.mjs'
import {Tier} from '~/types'

/**
 * Increment usage count for a customer
 */
export async function incrementUsage(prisma: PrismaClient, owner: string) {
	await prisma.customer.update({
		where: {
			name: owner
		},
		data: {
			usage: {
				increment: 1
			},
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
	email: string = ''
): Promise<string | void> => {
	try {
		const stripeSession = await stripe.checkout.sessions.create({
			client_reference_id: customerId,
			...(email && {
				customer_email: email
			}),
			mode: 'subscription',
			payment_method_types: ['card'],
			success_url:
				env.VERCEL === '1' ? 'https://maige.app/success' : 'http://localhost:3000',
			cancel_url:
				env.VERCEL === '1' ? 'https://maige.app/success' : 'http://localhost:3000',
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
