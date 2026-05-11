import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function normalizeSupabaseUrl(raw: string) {
  return raw.replace(/\/rest\/v1\/?$/, "");
}

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ authenticated: false, user: null, role: null, profile: null });
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const response = NextResponse.json({
      authenticated: false,
      user: null,
      role: null,
      profile: null,
    });
    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  const response = NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
    },
    role: profile?.role ?? null,
    profile: profile ?? null,
  });
  cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}

