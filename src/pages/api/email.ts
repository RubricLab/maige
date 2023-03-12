import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "~/lib/prisma";

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

  await prisma.customer.create({
    data: {
      email,
      name: email,
    },
  });

  return res.status(200).send({
    message: "Email added to list.",
  });
};
