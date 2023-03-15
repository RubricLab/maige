import { Resend } from "resend";

export const { sendEmail } = new Resend(process.env.RESEND_KEY);
