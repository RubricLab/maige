import env from './env.mjs'

export const STRIPE = {
	PAYMENT_LINK: 'https://buy.stripe.com/aEU8yd0OIfd62ha6op'
}

export const GITHUB = {
	BASE_URL: 'https://github.com'
}

export const MAX_BODY_LENGTH = 2000

export const TIERS = {
	base: {
		usageLimit: 20,
		priceId: env.STRIPE_BASE_PRICE_ID || ''
	}
}

export const COPY = {
	FOOTER: `<sub>From [Maige](https://maige.app). How's my driving?</sub>`
}
