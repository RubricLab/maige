import type { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "~/lib/prisma";
import { stripe } from "~/lib/stripe";

const CRON_KEY = "9D7042C6-CEE2-454A-8E4F-65BD8976DA7F";

/**
 * GET /api/cron/usage-to-stripe
 */
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
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
    },
  });

  for (const customer of activeCustomers) {
    const { id: customerId, stripeSubscriptionId, usage } = customer;

    // Only applies to paying users
    if (!stripeSubscriptionId) {
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
          where: { id: customerId },
          data: {
            usage: 0,
            usageUpdatedAt: new Date(),
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

export default handle;
