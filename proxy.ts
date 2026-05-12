import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { redirectByRole } from "@/lib/auth/redirect-by-role";
import { normalizeSupabaseProjectUrl } from "@/lib/supabase/project-url";
import { isCafeDashboardRole, isStaffRole } from "@/lib/types/roles";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  const supabase = createServerClient(
    normalizeSupabaseProjectUrl(supabaseUrl),
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

  const pathname = request.nextUrl.pathname;
  const loginUrl = new URL("/auth/login", request.url);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = profile?.role ?? null;

  if (pathname.startsWith("/platform-admin")) {
    if (role === "platform_admin") {
      return response;
    }

    if (role === "customer") {
      return NextResponse.redirect(new URL("/customer", request.url));
    }

    if (isCafeDashboardRole(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.redirect(new URL("/customer", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    if (!role) {
      return response;
    }

    if (role === "platform_admin") {
      return NextResponse.redirect(new URL("/platform-admin", request.url));
    }

    if (!isCafeDashboardRole(role)) {
      return NextResponse.redirect(new URL("/customer", request.url));
    }

    return response;
  }

  if (pathname.startsWith("/customer")) {
    if (!role) {
      return response;
    }

    if (isStaffRole(role)) {
      return NextResponse.redirect(new URL(redirectByRole(role), request.url));
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/customer/:path*", "/platform-admin/:path*"],
};
