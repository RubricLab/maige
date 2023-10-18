import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "~/lib/stripe";
import { createPaymentLink } from "~/lib/utils/payment";

/**
 * Generate a Stripe payment URL for a customer.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
    const url = await createPaymentLink(stripe, customerId, tier, email);

    return res.status(200).send({
      url,
    });
  } catch {
    return res.status(500).send({
      message: "Failed to create Stripe session",
    });
  }
};

export default handler;
