import { LandingHome } from "@/components/landing/landing-home";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  await supabase.auth.getUser();

  return (
    <main className="relative">
      <LandingHome />
    </main>
  );
}