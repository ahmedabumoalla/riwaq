import "server-only";

import twilio from "twilio";

type SmsParams = {
  to: string;
  body: string;
};

export async function sendSmsNotification({ to, body }: SmsParams) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_PHONE;

  if (!sid || !token || !from) {
    console.warn("[sms] Twilio is not configured.");
    return { skipped: true };
  }

  const client = twilio(sid, token);

  return client.messages.create({
    to,
    from,
    body,
  });
}