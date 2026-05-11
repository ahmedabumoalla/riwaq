import { redirectByRole } from "./redirect-by-role";

export function safeNextPath(
  _nextPath?: string | null,
  role?: string | null
): string {
  return redirectByRole(role ?? "customer");
}