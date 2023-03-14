import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "~/lib/stripe";

const TIERS = {
  base: {
    priceId: process.env.STRIPE_BASE_PRICE_ID || "",
  },
};

type Tier = keyof typeof TIERS;

/**
 * Generate a Stripe payment URL for a customer.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).send({
      message: "Only POST requests are accepted.",
    });
  }

  const { tier, email, customerId } = req.body as any;

  if (!tier || !email || !customerId) {
    return res.status(400).send({
      message: "Missing required parameters",
    });
  }

  try {
    const url = await createPaymentLink(email, customerId, tier);

    return res.status(200).send({
      url,
    });
  } catch {
    return res.status(500).send({
      message: "Failed to create Stripe session",
    });
  }
};

/**
 * To re-use payment links in other places eg. welcome emails
 */
export const createPaymentLink = async (
  email: string,
  customerId: string,
  tier: Tier = "base"
) => {
  const stripeSession = await stripe.checkout.sessions.create({
    client_reference_id: customerId,
    customer_email: email,
    mode: "subscription",
    payment_method_types: ["card"],
    billing_address_collection: "required",
    success_url:
      process.env.VERCEL === "1"
        ? "https://maige.app"
        : "http://localhost:3000",
    cancel_url:
      process.env.VERCEL === "1"
        ? "https://maige.app"
        : "http://localhost:3000",
    line_items: [
      {
        price: TIERS[tier].priceId,
      },
    ],
    automatic_tax: {
      enabled: true,
    },
    tax_id_collection: {
      enabled: true,
    },
  });

  if (!stripeSession?.url) {
    throw new Error("Failed to create Stripe session");
  }

  return stripeSession.url;
};
