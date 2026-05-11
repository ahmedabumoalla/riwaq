import { NextResponse } from "next/server";
import { sendEmailNotification } from "@/lib/notifications/email";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { to?: string; subject?: string; html?: string };
    const to = body.to?.trim();
    const subject = body.subject?.trim();
    const html = body.html?.trim();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, message: "حقول البريد مطلوبة: to, subject, html" },
        { status: 400 },
      );
    }

    const result = await sendEmailNotification({ to, subject, html });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("[api/notifications/email]", error);
    return NextResponse.json({ success: false, message: "فشل إرسال البريد." }, { status: 500 });
  }
}

