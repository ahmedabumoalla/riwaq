import Link from "next/link";
import { LandingHome } from "@/components/landing/landing-home";
import { createClient } from "@/lib/supabase/server";
import { redirectByRole } from "@/lib/auth/redirect-by-role";
import { isStaffRole } from "@/lib/types/roles";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: {
    full_name: string | null;
    email: string | null;
    role: string | null;
    avatar_url?: string | null;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, role, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    profile = data;
  }

  const dashboardHref = profile?.role
    ? redirectByRole(profile.role)
    : "/auth/login";

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2) || "ر";

  return (
    <main className="relative">
      <LandingHome />

      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-[#3B2416]/90 p-3 shadow-2xl backdrop-blur-xl">
        {user && profile ? (
          <>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name ?? "User"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C78A45] text-sm font-extrabold text-white">
                  {initials}
                </div>
              )}

              <div className="hidden text-right sm:block">
                <p className="text-sm font-extrabold text-white">
                  {profile.full_name ?? "مستخدم رِواق"}
                </p>
                <p className="text-xs font-bold text-white/60">
                  {isStaffRole(profile.role ?? "") ? "حساب كوفي" : "حساب عميل"}
                </p>
              </div>
            </div>

            <Link
              href={dashboardHref}
              className="rounded-xl bg-[#C78A45] px-5 py-3 text-sm font-bold text-white transition hover:scale-105 hover:bg-[#b77933]"
            >
              الذهاب للوحة التحكم
            </Link>

            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3B2416] transition hover:scale-105"
              >
                خروج
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="rounded-xl bg-[#C78A45] px-5 py-3 text-sm font-bold text-white transition hover:scale-105 hover:bg-[#b77933]"
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/auth/register"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#3B2416] transition hover:scale-105"
            >
              إنشاء حساب
            </Link>

            <Link
              href="/dashboard"
              className="hidden rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:scale-105 sm:inline-flex"
            >
              معاينة الكوفي
            </Link>

            <Link
              href="/customer"
              className="hidden rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:scale-105 sm:inline-flex"
            >
              معاينة العميل
            </Link>
          </>
        )}
      </div>
    </main>
  );
}