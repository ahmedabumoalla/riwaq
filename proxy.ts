import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { redirectByRole } from "@/lib/auth/redirect-by-role";
import { isStaffRole } from "@/lib/types/roles";

function normalizeSupabaseUrl(raw: string) {
  return raw.replace(/\/rest\/v1\/?$/, "");
}

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  const supabase = createServerClient(
    normalizeSupabaseUrl(supabaseUrl),
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  let cachedRole: string | null | undefined = undefined;

  async function getRole() {
    if (cachedRole !== undefined) return cachedRole;
    if (!user) {
      cachedRole = null;
      return cachedRole;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    cachedRole = data?.role ?? null;
    return cachedRole;
  }

  // dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    const role = await getRole();

    if (!role) {
      return response;
    }

    if (!isStaffRole(role)) {
      return NextResponse.redirect(
        new URL("/customer", request.url)
      );
    }

    return response;
  }

  // customer
  if (pathname.startsWith("/customer")) {
    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    const role = await getRole();

    if (!role) {
      return response;
    }

    if (isStaffRole(role)) {
      return NextResponse.redirect(
        new URL(redirectByRole(role), request.url)
      );
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customer/:path*",
  ],
};