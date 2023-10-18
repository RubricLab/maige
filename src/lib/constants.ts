export const STRIPE = {
  PAYMENT_LINK: "https://buy.stripe.com/aEU8yd0OIfd62ha6op",
};

export const MAX_BODY_LENGTH = 2000;

export const TIERS = {
  base: {
    usageLimit: 20,
    priceId: process.env.STRIPE_BASE_PRICE_ID || "",
  },
};
