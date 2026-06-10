import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/app/components/landing/landing-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const fullName = user?.user_metadata?.full_name || null;
  const userEmail = user?.email || null;
  const bio = user?.user_metadata?.bio || null;
  const quote = user?.user_metadata?.quote || null;
  const isAdmin = user?.app_metadata?.role === "Admin";

  return (
    <LandingPage
      isLoggedIn={!!user}
      isAdmin={isAdmin}
      avatarUrl={avatarUrl}
      userEmail={userEmail}
      fullName={fullName}
      bio={bio}
      quote={quote}
    />
  );
}
