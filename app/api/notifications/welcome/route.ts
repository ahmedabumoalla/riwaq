import { NextResponse } from "next/server";
import { sendWelcomeIfNeeded } from "../../../../lib/notifications/welcome";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      userId?: string;
      email?: string | null;
      phone?: string | null;
      fullName?: string | null;
    };
    if (!body.userId) {
      return NextResponse.json({ success: false, message: "userId مطلوب" }, { status: 400 });
    }

    const result = await sendWelcomeIfNeeded({
      userId: body.userId,
      email: body.email ?? null,
      phone: body.phone ?? null,
      fullName: body.fullName ?? null,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[api/welcome]", error);
    return NextResponse.json({ success: false, message: "server_error" }, { status: 500 });
  }
}
