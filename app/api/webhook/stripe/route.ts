import { stripe } from "lib/stripe";
import prisma from "lib/prisma";
import Stripe from "stripe";
import env from "~/env.mjs";
import { headers } from "next/headers";

/**
 * POST /api/webhook/stripe
 *
 * Stripe webhook handler
 */
export const POST = async (req: Request) => {
  const payload = await req.text();

  const headersList = headers();
  const signature = headersList.get("stripe-signature") || "";

  if (!signature) {
    return Response.json({ message: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error) {
    console.error("Bad Stripe webhook secret");
    return Response.json(
      {
        message: "Stripe webhook error",
      },
      { status: 400 }
    );
  }

  const {
    type: eventType,
    data: { object },
  } = event;

  const { customer } = object as any;

  if (eventType === "checkout.session.completed") {
    const { client_reference_id: customerId } = object as any;

    if (!customerId) {
      return Response.json(
        { message: "Stripe checkout session missing customer ID in webhook" },
        { status: 400 }
      );
    }

    await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        stripeCustomerId: customer,
        usageLimit: 1000,
      },
    });
  } else if (eventType === "customer.subscription.created") {
    /**
     * Customer created
     */
    const subscriptionItem = (object as any).items.data.find(
      (item: any) => item.object === "subscription_item"
    );

    if (!subscriptionItem) {
      return Response.json(
        {
          message: "Could not find Stripe subscription item",
        },
        { status: 400 }
      );
    }

    await prisma.customer.update({
      where: {
        stripeCustomerId: customer,
      },
      data: {
        stripeSubscriptionId: subscriptionItem.id,
      },
    });
  } else if (eventType === "customer.subscription.deleted") {
    /**
     * Customer deleted
     */
    try {
      await prisma.customer.delete({
        where: {
          stripeCustomerId: customer,
        },
      });
    } catch {
      return Response.json({
        message: "No customer to delete in DB",
      });
    }
  } else if (eventType === "customer.subscription.updated") {
    /**
     * Customer updated
     */
    const subscriptionItem = (object as any).items.data.find(
      (item: any) => item.object === "subscription_item"
    );

    if (!subscriptionItem) {
      return Response.json(
        {
          message: "Could not find Stripe subscription item",
        },
        { status: 400 }
      );
    }

    try {
      await prisma.customer.update({
        where: {
          stripeCustomerId: customer,
        },
        data: {
          stripeSubscriptionId: subscriptionItem.id,
        },
      });
    } catch (error) {
      console.log("Customer update error:", error);

      return Response.json({
        message: "No customer to update in DB",
      });
    }
  } else {
    console.log(`Unhandled Stripe webhook event type: ${eventType}`);
  }

  return Response.json({
    message: "Stripe webhook received",
  });
};
