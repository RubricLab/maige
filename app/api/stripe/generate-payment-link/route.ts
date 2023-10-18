import { stripe } from "lib/stripe";
import { createPaymentLink } from "lib/utils/payment";
import { NextRequest, NextResponse } from "next/server";

/**
 * Generate a Stripe payment URL for a customer.
 */
export const POST = async (req: NextRequest) => {
  const { tier, email, customerId } = await req.json();

  if (!tier || !customerId) {
    return NextResponse.json(
      {
        message: "Missing required parameters",
      },
      { status: 400 }
    );
  }

  try {
    const url = await createPaymentLink(stripe, customerId, tier, email);

    return NextResponse.json({
      url,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create Stripe session",
      },
      { status: 500 }
    );
  }
};
