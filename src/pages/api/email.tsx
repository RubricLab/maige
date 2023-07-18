import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "~/lib/prisma";
import WaitlistTemplate from "~/components/email/Waitlist";
import { createPaymentLink } from "./stripe/generate-payment-link";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);
const DEFAULT_REPLY_TO = "Ted<ted@rubriclab.com>";
const DEFAULT_FROM = "Maige<ted@maige.app>";

/**
 * Add an email to the mailing list.
 */
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
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
        name: email,
      },
    });

    const paymentLink = await createPaymentLink(customerId, "base", email);

    if (!paymentLink) {
      console.warn("Failed to create payment link.");
      return res.status(500).send({
        message: "Failed to create payment link.",
      });
    }

    await sendEmail(
      email,
      "You've joined the Maige waitlist",
      <WaitlistTemplate link={paymentLink} />
    );
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

/**
 * Send an email
 */
export async function sendEmail(
  email: string,
  subject: string,
  react: React.ReactElement
) {
  await resend.sendEmail({
    to: email,
    from: DEFAULT_FROM,
    reply_to: DEFAULT_REPLY_TO,
    subject,
    react,
  });
}

export default handle;
