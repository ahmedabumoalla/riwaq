import { NextResponse } from "next/server";
import { sendSmsNotification } from "@/lib/notifications/sms";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { to?: string; message?: string };
    const to = body.to?.trim();
    const message = body.message?.trim();

    if (!to || !message) {
      return NextResponse.json(
        { success: false, message: "حقول الرسالة مطلوبة: to, message" },
        { status: 400 },
      );
    }

    const result = await sendSmsNotification({ to, body: message });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("[api/notifications/sms]", error);
    return NextResponse.json({ success: false, message: "فشل إرسال SMS." }, { status: 500 });
  }
}

