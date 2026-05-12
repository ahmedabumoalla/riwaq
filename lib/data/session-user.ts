import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PlatformRole } from "@/lib/types/roles";

export type SessionUser = { id: string; email: string | undefined; role: PlatformRole | null };

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return {
    id: user.id,
    email: user.email ?? undefined,
    role: (profile?.role as PlatformRole | null) ?? null,
  };
}
