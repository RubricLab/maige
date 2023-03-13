import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "~/lib/stripe";

/**
 * Generate a Stripe payment URL for a customer.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).send({
      message: "Only POST requests are accepted.",
    });
  }

  const { priceId, email, customerId } = req.body as any;

  if (!priceId || !email || !customerId) {
    return res.status(400).send({
      message: "Missing required parameters",
    });
  }

  const stripeSession = await stripe.checkout.sessions.create({
    client_reference_id: customerId,
    customer_email: email,
    mode: "subscription",
    payment_method_types: ["card"],
    billing_address_collection: "required",
    success_url: `${
      process.env.VERCEL === "1" ? "https://maige.app" : "http://localhost:3000"
    }`,
    cancel_url: `${
      process.env.VERCEL === "1" ? "https://maige.app" : "http://localhost:3000"
    }`,
    line_items: [{ price: priceId }],
    automatic_tax: {
      enabled: true,
    },
    tax_id_collection: {
      enabled: true,
    },
  });

  if (!stripeSession?.url) {
    return res.status(500).send({
      message: "Failed to create Stripe session",
    });
  }

  return res.status(200).send({
    url: stripeSession.url,
  });
};
