import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

const supabase = createClient();

export async function getProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") { // Ignore 'not found' error
    console.error("Error fetching profile:", error);
    return null;
  }
  
  if (!data) {
    // Return default profile if not exist yet
    return {
      id: user.id,
      preferred_currency: "IDR"
    };
  }
  
  return data;
}

export async function updateProfileCurrency(currency: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      preferred_currency: currency,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error("Error updating profile currency:", error);
    return false;
  }
  return true;
}
