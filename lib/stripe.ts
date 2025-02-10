import Stripe from 'stripe'
import env from './env'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2025-01-27.acacia',
	appInfo: {
		name: 'Maige',
		version: '0.1.0'
	}
})
