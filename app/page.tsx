import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/app/components/landing/landing-page";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const userEmail = user?.email || null;
  const bio = user?.user_metadata?.bio || null;
  const quote = user?.user_metadata?.quote || null;

  return <LandingPage isLoggedIn={!!user} avatarUrl={avatarUrl} userEmail={userEmail} bio={bio} quote={quote} />;
}
