import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PlatformRole } from "@/lib/types/roles";

export async function getUserRole(userId: string): Promise<PlatformRole | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (error || !data?.role) return null;
  return data.role as PlatformRole;
}

