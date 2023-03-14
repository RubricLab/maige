import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "~/lib/prisma";
import { Resend } from "resend";
import WaitlistTemplate from "~/components/email/Waitlist";
import { createPaymentLink } from "./stripe/generate-payment-link";

const resend = new Resend(process.env.RESEND_KEY);
const FROM_EMAIL = "hi@maige.app";
const REPLY_TO_EMAIL = "ted@neat.run";
const BASE_PRICE_ID = "price_1Mkwr7JD5KS2kmKy7qk0t6Ra";
const WAITLIST_SUBJECT = "You've joined the Maige waitlist";

/**
 * Add an email to the mailing list.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).send({
      message: "Only POST requests are accepted.",
    });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).send({
      message: "Email is required.",
    });
  }

  try {
    const { id: customerId } = await prisma.customer.create({
      data: {
        email,
        name: email,
      },
    });

    const paymentLink = await createPaymentLink(
      BASE_PRICE_ID,
      email,
      customerId
    );

    await resend.sendEmail({
      from: FROM_EMAIL,
      reply_to: REPLY_TO_EMAIL,
      to: email,
      subject: WAITLIST_SUBJECT,
      react: <WaitlistTemplate link={paymentLink} />,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(202).send({
        message: "Email already on list.",
      });
    }

    return res.status(500).send({
      message: "Failed to add email to list.",
    });
  }

  return res.status(201).send({
    message: "Email added to list.",
  });
};
