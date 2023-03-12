import type { NextApiRequest, NextApiResponse } from "next/types";
import { stripe } from "~/lib/stripe";
import { buffer } from "micro";
import prisma from "~/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers["stripe-signature"] || "";
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (error) {
    return res.status(400).send({
      message: "Stripe webhook error",
    });
  }

  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).send({
      message: "Only POST requests are accepted.",
    });
  }

  const {
    type: eventType,
    data: { object },
  } = event;

  const { customer } = object as any;

  switch (eventType) {
    case "checkout.session.completed":
      // TODO: pass customer ID (from DB) to the checkout session somehow
      const { client_reference_id } = object as any;

      await prisma.customer.update({
        where: {
          id: client_reference_id,
        },
        data: {
          stripeCustomerId: customer,
        },
      });

      break;
    case "customer.subscription.deleted":
      await prisma.customer.delete({
        where: {
          stripeCustomerId: customer,
        },
      });

      break;
    case "customer.subscription.updated":
      console.log("customerSubscriptionUpdated", object);

      break;
    default:
      console.log(`Unhandled Stripe webhook event type: ${eventType}`);
  }

  return res.status(200).send({
    message: "Stripe webhook received",
  });
};
