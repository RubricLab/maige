import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "~/lib/stripe";

export const TIERS = {
  base: {
    usageLimit: 20,
    priceId: process.env.STRIPE_BASE_PRICE_ID || "",
  },
};

type Tier = keyof typeof TIERS;

/**
 * Generate a Stripe payment URL for a customer.
 */
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).send({
      message: "Only POST requests are accepted.",
    });
  }

  const { tier, email, customerId } = req.body as any;

  if (!tier || !customerId) {
    return res.status(400).send({
      message: "Missing required parameters",
    });
  }

  try {
    const url = await createPaymentLink(customerId, tier, email);

    return res.status(200).send({
      url,
    });
  } catch {
    return res.status(500).send({
      message: "Failed to create Stripe session",
    });
  }
};

export default handle;

/**
 * To re-use payment links in other places eg. welcome emails
 */
export const createPaymentLink = async (
  customerId: string,
  tier: Tier = "base",
  email: string = ""
): Promise<string | void> => {
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      client_reference_id: customerId,
      ...(email && {
        customer_email: email,
      }),
      mode: "subscription",
      payment_method_types: ["card"],
      success_url:
        process.env.VERCEL === "1"
          ? "https://maige.app/success"
          : "http://localhost:3000",
      cancel_url:
        process.env.VERCEL === "1"
          ? "https://maige.app/success"
          : "http://localhost:3000",
      line_items: [
        {
          price: TIERS[tier].priceId,
          quantity: 1,
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
  } catch (err) {
    console.warn("Error creating payment link: ", err);
    return;
  }
};
