import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function normalizeSupabaseUrl(raw: string) {
  return raw.replace(/\/rest\/v1\/?$/, "");
}

async function doLogout(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
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

  await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/auth/login", request.url));
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}

export async function POST(request: NextRequest) {
  return doLogout(request);
}

export async function GET(request: NextRequest) {
  return doLogout(request);
}

