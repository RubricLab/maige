import type { NextApiRequest } from "next/types";
import { createHmac, timingSafeEqual } from "crypto";

export const isDev = process.env.NODE_ENV === "development";

// Validate the GitHub webhook signature
export const validateSignature = (req: NextApiRequest): boolean => {
  const signature = req.headers["x-hub-signature-256"] as string;
  const HMAC = createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET || "");
  const digest = Buffer.from(
    `sha256=${HMAC.update(JSON.stringify(req.body)).digest("hex")}`,
    "utf-8"
  );
  const signatureBuffer = Buffer.from(signature, "utf-8");
  const isValid = timingSafeEqual(digest, signatureBuffer);

  return isValid;
};
