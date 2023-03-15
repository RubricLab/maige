import type { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "~/lib/prisma";
import { stripe } from "~/lib/stripe";
import { Resend } from "resend";

const CRON_KEY = "9D7042C6-CEE2-454A-8E4F-65BD8976DA7F";
const resend = new Resend(process.env.RESEND_KEY);

/**
 * GET /api/cron/usage-to-stripe
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).send({
      message: "Only GET requests are accepted.",
    });
  }

  if (req.query.key !== CRON_KEY) {
    return res.status(403).send({
      message: "Bad cron key.",
    });
  }

  const now = new Date().getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  const activeCustomers = await prisma.customer.findMany({
    where: {
      usageUpdatedAt: {
        gte: new Date(now - oneDay),
      },
    },
  });

  for (const customer of activeCustomers) {
    const { stripeCustomerId, usage, usageLimit, email } = customer;

    if (!stripeCustomerId) {
      await resend.sendEmail({
        from: "usage@maige.app",
        to: "ted@neat.run", // TODO: use email from customer
        subject: "Maige usage limit",
        // TODO: add payment link
        text: `Hi there, ${customer.name}. We see that you've used ${usage} issues out of the limit of ${usageLimit}. Please update your payment in Stripe to continue.`,
      });
      continue;
    }

    await stripe.subscriptionItems.createUsageRecord(
      "si_NVzE7g7DQ9hzEQ", // hardcoded to my subscription
      {
        quantity: usage,
        timestamp: Math.floor(new Date().getTime() / 1000),
        action: "set",
      }
    );
  }

  return res.status(200).send({
    message: "Cron request received",
  });
};
