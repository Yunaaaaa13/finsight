"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const adminClient = createAdminClient();
  
  const { data: { users }, error } = await adminClient.auth.admin.listUsers();
  
  if (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message };
  }

  // Format the users
  const formattedUsers = users.map(user => {
    // Determine status (if banned_until is set to a future date or exists, they are suspended)
    const isBanned = user.banned_until ? new Date(user.banned_until) > new Date() : false;
    
    return {
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Unknown",
      email: user.email || "",
      role: user.app_metadata?.role || "User",
      status: isBanned ? "Suspended" : "Active",
      joined: new Date(user.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) : "Never",
    };
  });

  return { success: true, users: formattedUsers };
}

export async function updateUserRole(userId: string, newRole: "Admin" | "User") {
  try {
    const adminClient = createAdminClient();
    
    const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
      app_metadata: { role: newRole }
    });

    if (error) throw error;
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update role" };
  }
}

export async function toggleSuspendUser(userId: string, isCurrentlySuspended: boolean) {
  try {
    const adminClient = createAdminClient();
    
    // To suspend, we set a far future date. To unsuspend, we set it to null or past.
    // In Supabase, setting ban_duration to "none" removes the ban.
    const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
      ban_duration: isCurrentlySuspended ? "none" : "8760h", // 1 year ban roughly
    });

    if (error) throw error;
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle suspension" };
  }
}

export async function resetUserPassword(userId: string) {
  // We can't actually see their password, but we can generate a password reset email if we want,
  // or we can just send them a recovery link via admin API.
  // Actually, auth.admin.generateLink is useful here.
  try {
    const adminClient = createAdminClient();
    
    // Just fetch the user to get their email
    const { data: { user }, error: fetchError } = await adminClient.auth.admin.getUserById(userId);
    if (fetchError || !user?.email) throw new Error("Could not find user or email");
    
    // Generate recovery link
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email: user.email,
    });
    
    if (linkError) throw linkError;
    
    return { success: true, link: linkData.properties.action_link };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to generate reset link" };
  }
}
