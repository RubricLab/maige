import type { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "~/lib/prisma";
import { stripe } from "~/lib/stripe";
import { Resend } from "resend";
import { createPaymentLink } from "../stripe/generate-payment-link";
import UsageTemplate from "~/components/email/UsageAlert";

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
      usage: {
        gt: 0,
      },
    },
    select: {
      id: true,
      stripeSubscriptionId: true,
      usage: true,
      usageLimit: true,
      email: true,
    },
  });

  for (const customer of activeCustomers) {
    const { id, stripeSubscriptionId, usage, usageLimit, email } = customer;

    if (!stripeSubscriptionId) {
      if (usage > usageLimit) {
        const paymentLink = await createPaymentLink(email || "", id);

        await resend.sendEmail({
          from: "Maige<usage@maige.app>",
          reply_to: "Ted<ted@neat.run>",
          to: "ted@neat.run", // TODO: use email from customer
          subject: "Upgrade your usage limit",
          react: <UsageTemplate link={paymentLink} />,
        });
      }

      continue;
    }

    try {
      const stripeUsageResult =
        await stripe.subscriptionItems.createUsageRecord(stripeSubscriptionId, {
          quantity: usage,
          timestamp: Math.floor(new Date().getTime() / 1000),
          action: "set",
        });

      if (stripeUsageResult) {
        // TODO: collect + batch-update these for efficiency
        await prisma.customer.update({
          where: { id },
          data: {
            usage: 0,
          },
        });
      }
    } catch (error) {
      console.error("Error updating Stripe usage: ", error);
    }
  }

  return res.status(200).send({
    message: "Cron request received",
  });
};
