import type { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).send({
      success: false,
      message: "Only POST requests are accepted.",
    });
  }

  const { data } = req.body;

  console.log("Webhook received! Data", data);

  return res.status(200).send({
    success: true,
    message: "Webhook received",
  });
};
