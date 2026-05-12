import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PlatformRole } from "@/lib/types/roles";

export type SessionUser = { id: string; email: string | undefined; role: PlatformRole | null };

/** طلب واحد = استعلام واحد لـ profiles.role (React cache) */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
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
});
