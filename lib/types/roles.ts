/**
 * أدوار المنصة — مرتبطة بجدول public.profiles في Supabase.
 * ترقية موظف: تحديث role عبر لوحة Supabase أو عميل service_role (لا من الواجهة العامة).
 */

export const PLATFORM_ROLES = [
  "platform_admin",
  "cafe_owner",
  "branch_manager",
  "cashier",
  "barista",
  "customer",
] as const;

export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export const PLATFORM_ROLE_LABELS_AR: Record<PlatformRole, string> = {
  platform_admin: "مسؤول المنصة",
  cafe_owner: "مالك الكوفي",
  branch_manager: "مدير الفرع",
  cashier: "كاشير",
  barista: "باريستا",
  customer: "عميل",
};

export const STAFF_ROLES: PlatformRole[] = [
  "platform_admin",
  "cafe_owner",
  "branch_manager",
  "cashier",
  "barista",
];

/** أدوار تدخل لوحة تشغيل الكافيه (ليست إدارة المنصة). */
export const CAFE_DASHBOARD_ROLES: readonly string[] = [
  "cafe_owner",
  "branch_manager",
  "cashier",
  "barista",
];

export function isStaffRole(role: string | null | undefined): role is Exclude<PlatformRole, "customer"> {
  return role != null && role !== "customer" && (STAFF_ROLES as readonly string[]).includes(role);
}

export function isCafeDashboardRole(role: string | null | undefined): boolean {
  return role != null && CAFE_DASHBOARD_ROLES.includes(role);
}
