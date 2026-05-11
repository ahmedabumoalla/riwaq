import type { Metadata } from "next";
import { CustomerShell } from "@/components/customer/customer-shell";
import { initialsFromName } from "@/lib/auth/display";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: {
    template: "%s — رِواق للعملاء",
    default: "رِواق للعملاء",
  },
  description: "تجربة العميل — طلبات، حجوزات، ولاء، ومشاركة التجربة.",
};

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const fallbackUser = {
    fullName: "عميل",
    initials: "عم",
    loyaltyPoints: 0,
  };

  if (!user) {
    return <CustomerShell user={fallbackUser}>{children}</CustomerShell>;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, loyalty_points")
    .eq("id", user.id)
    .maybeSingle();

  const fullName = profile?.full_name?.trim() || user.email || "عميل";
  const userShell = {
    fullName,
    initials: initialsFromName(fullName),
    loyaltyPoints: profile?.loyalty_points ?? 0,
  };

  return <CustomerShell user={userShell}>{children}</CustomerShell>;
}
