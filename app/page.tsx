import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/app/components/landing/landing-page";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarUrl = user?.user_metadata?.avatar_url || null;

  return <LandingPage isLoggedIn={!!user} avatarUrl={avatarUrl} />;
}
