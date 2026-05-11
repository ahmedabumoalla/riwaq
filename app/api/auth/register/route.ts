import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirectByRole } from "@/lib/auth/redirect-by-role";
import { sendEmailNotification } from "@/lib/notifications/email";
import { sendSmsNotification } from "@/lib/notifications/sms";

type AccountType = "customer" | "cafe_owner";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      full_name?: string;
      email?: string;
      phone?: string;
      password?: string;
      account_type?: AccountType;
    };

    const fullName = body.full_name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const phone = body.phone?.trim() ?? "";
    const password = body.password ?? "";
    const accountType: AccountType = body.account_type === "cafe_owner" ? "cafe_owner" : "customer";

    if (!fullName || !email || !phone || password.length < 8) {
      return NextResponse.json(
        { success: false, message: "بيانات التسجيل غير مكتملة أو غير صحيحة." },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const role = accountType === "cafe_owner" ? "cafe_owner" : "customer";

    const { data: authData, error: createUserError } = await admin.auth.admin.createUser({
      email,
      password,
      phone,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        full_name: fullName,
        account_type: accountType,
      },
    });

    if (createUserError || !authData.user) {
      return NextResponse.json(
        { success: false, message: createUserError?.message ?? "تعذر إنشاء المستخدم." },
        { status: 400 },
      );
    }

    const userId = authData.user.id;

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: userId,
        full_name: fullName,
        email,
        phone,
        role,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      await admin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { success: false, message: "فشل إنشاء ملف المستخدم." },
        { status: 500 },
      );
    }

    if (accountType === "cafe_owner") {
      try {
        const { data: cafeData, error: cafeError } = await admin
          .from("cafes")
          .insert({
            owner_id: userId,
            name: "كوفي رِواق",

          })
          .select("id")
          .single();

        if (cafeError) throw cafeError;

        const { error: branchError } = await admin.from("branches").insert({
          cafe_id: cafeData.id,
          name: "الفرع الرئيسي",

          is_active: true,
        });

        if (branchError) throw branchError;
      } catch (error) {
        console.error("[register][cafe-branch]", error);
      }
    }

    try {
      await sendEmailNotification({
        to: email,
        subject: "مرحبًا بك في رِواق",
        html: `<div dir="rtl"><p>مرحبًا ${fullName}،</p><p>تم إنشاء حسابك بنجاح في منصة رِواق.</p></div>`,
      });
    } catch (error) {
      console.error("[register][email]", error);
    }

    try {
      await sendSmsNotification({
        to: phone,
        body: "مرحبًا بك في رِواق — تم إنشاء حسابك بنجاح.",
      });
    } catch (error) {
      console.error("[register][sms]", error);
    }

    return NextResponse.json({
      success: true,
      role,
      redirectTo: redirectByRole(role),
    });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json({ success: false, message: "خطأ غير متوقع." }, { status: 500 });
  }
}

