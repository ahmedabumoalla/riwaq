import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { redirectByRole } from "@/lib/auth/redirect-by-role";

function normalizeSupabaseUrl(raw: string) {
  return raw.replace(/\/rest\/v1\/?$/, "");
}

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return NextResponse.json({ success: false, message: "إعدادات Supabase غير مكتملة." }, { status: 500 });
  }

  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "أدخل البريد وكلمة المرور." }, { status: 400 });
  }

  const cookiesToSet: { name: string; value: string; options?: any }[] = [];

  const supabase = createServerClient(normalizeSupabaseUrl(url), anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list) {
        cookiesToSet.push(...list);
      },
    },
  });

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !signInData.user) {
    return NextResponse.json(
      { success: false, message: signInError?.message ?? "فشل تسجيل الدخول." },
      { status: 401 },
    );
  }

  const user = signInData.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role ?? "customer";
  const redirectTo = redirectByRole(role);

  const response = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
    },
    role,
    redirectTo,
  });

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

