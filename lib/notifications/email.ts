import "server-only";

import { Resend as ResendClient } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

const resend = resendApiKey ? new ResendClient(resendApiKey) : null;

export async function sendEmailNotification(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend || !resendFromEmail) {
    console.warn("[email] Resend is not configured.");
    return { skipped: true };
  }

  return resend.emails.send({
    from: resendFromEmail,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });
}