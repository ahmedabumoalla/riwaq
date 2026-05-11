import type { PlatformRole } from "@/lib/types/roles";
import { isStaffRole } from "@/lib/types/roles";
import { redirectByRole } from "@/lib/auth/redirect-by-role";

export function defaultPathForRole(role: PlatformRole | string | null | undefined): "/dashboard" | "/customer" {
  if (isStaffRole(role)) return "/dashboard";
  return "/customer";
}

/**
 * يضمن أن مسار `next` متوافق مع دور المستخدم.
 */
export function safeNextPath(
  _next: string | null | undefined,
  role: PlatformRole | string | null | undefined,
): string {
  // معطّل مؤقتًا لتفادي أي redirect loop، والاعتماد فقط على role
  return redirectByRole(role);
}
