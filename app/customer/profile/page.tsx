import type { Metadata } from "next";
import { CustomerProfileView } from "@/components/customer/views/profile-view";
import { initialsFromName } from "@/lib/auth/display";
import { createClient } from "@/lib/supabase/server";
import type { PlatformRole } from "@/lib/types/roles";

export const metadata: Metadata = {
  title: "حسابي",
};

export default async function CustomerProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <CustomerProfileView
        account={{
          fullName: "عميل",
          initials: "عم",
          email: null,
          phone: null,
          loyaltyPoints: 0,
          role: "customer",
          memberSince: "—",
        }}
      />
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, email, phone, loyalty_points, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return (
      <CustomerProfileView
        account={{
          fullName: user.email ?? "عميل",
          initials: initialsFromName(user.email ?? "عميل"),
          email: user.email ?? null,
          phone: null,
          loyaltyPoints: 0,
          role: "customer",
          memberSince: "—",
        }}
      />
    );
  }

  const fullName = profile.full_name?.trim() || user.email || "عميل";
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const account = {
    fullName,
    initials: initialsFromName(fullName),
    email: profile.email ?? user.email ?? null,
    phone: profile.phone ?? null,
    loyaltyPoints: profile.loyalty_points ?? 0,
    role: profile.role as PlatformRole,
    memberSince,
  };

  return <CustomerProfileView account={account} />;
}
