import type { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "~/lib/prisma";
import { sendEmail } from "~/lib/resend";
import { stripe } from "~/lib/stripe";

// TODO: import this from .env in Vercel.json. Hardcoded for now.
const CRON_KEY = "9D7042C6-CEE2-454A-8E4F-65BD8976DA7F";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).send({
      message: "Only POST requests are accepted.",
    });
  }

  console.log("Running cron job...");

  if (req.query.key !== CRON_KEY) {
    console.log("Bad cron key");

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
    const { stripeCustomerId, usage, usageLimit } = customer;

    if (!stripeCustomerId) {
      // TODO: send email to trial user if usage is over 10
      await sendEmail({
        from: "alerts@maige.app",
        to: "ted@neat.run",
        subject: `Maige trial user over ${usageLimit}`,
        text: `Maige trial user ${customer.name} is over ${usageLimit} at ${usage}. Updating in Stripe.`,
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
