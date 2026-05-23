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

export async function getPlatformAnalytics() {
  try {
    const adminClient = createAdminClient();
    
    // Total users
    const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers();
    if (usersError) throw usersError;
    const totalUsers = users.length;
    
    // Active users (signed in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = users.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) >= thirtyDaysAgo).length;

    // Total transactions
    const { data: transactions, error: txError } = await adminClient.from("transactions").select("*");
    if (txError) throw txError;

    const totalTransactionsAmount = transactions?.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0;
    
    // Monthly growth
    const now = new Date();
    const currentMonthTxs = transactions?.filter(tx => {
      const d = new Date(tx.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }) || [];
    
    const lastMonthTxs = transactions?.filter(tx => {
      const d = new Date(tx.date);
      // handle year wrap around
      const targetMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const targetYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    }) || [];

    const currentMonthVolume = currentMonthTxs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const lastMonthVolume = lastMonthTxs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    
    let monthlyGrowth = 0;
    if (lastMonthVolume > 0) {
      monthlyGrowth = Math.round(((currentMonthVolume - lastMonthVolume) / lastMonthVolume) * 100);
    } else if (currentMonthVolume > 0) {
      monthlyGrowth = 100; // infinite growth from 0
    }

    // Category breakdown (expenses only)
    const expenses = transactions?.filter(tx => tx.type === "expense") || [];
    const categoryTotals: Record<string, number> = {};
    let totalExpenseAmount = 0;
    expenses.forEach(tx => {
      const amount = Number(tx.amount) || 0;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amount;
      totalExpenseAmount += amount;
    });

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenseAmount > 0 ? Math.round((amount / totalExpenseAmount) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalTransactionsAmount,
        monthlyGrowth,
        categoryBreakdown
      }
    };
  } catch (err: any) {
    console.error("Analytics Error:", err);
    return { success: false, error: err.message || "Failed to fetch analytics" };
  }
}

export async function getGlobalTransactions() {
  try {
    const adminClient = createAdminClient();
    // Using descending order
    const { data: transactions, error } = await adminClient
      .from("transactions")
      .select(`*`) 
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Fetch users to map emails
    const { data: { users } } = await adminClient.auth.admin.listUsers();
    const userMap: Record<string, string> = {};
    users.forEach(u => userMap[u.id] = u.email || "Unknown");

    const mappedTransactions = transactions?.map(tx => ({
      ...tx,
      user_email: userMap[tx.user_id] || "Unknown User"
    })) || [];

    return { success: true, transactions: mappedTransactions };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch global transactions" };
  }
}

export async function getRiskAlerts() {
  try {
    const adminClient = createAdminClient();
    const { data: transactions, error } = await adminClient.from("transactions").select("*");
    if (error) throw error;

    const { data: { users } } = await adminClient.auth.admin.listUsers();
    const userMap: Record<string, string> = {};
    users.forEach(u => userMap[u.id] = u.email || "Unknown");

    const alerts: any[] = [];
    const HIGH_SPEND_THRESHOLD = 10000000; // Rp 10 million

    transactions?.forEach(tx => {
      const amount = Number(tx.amount) || 0;
      if (tx.type === "expense" && amount > HIGH_SPEND_THRESHOLD) {
        alerts.push({
          id: `spike-${tx.id}`,
          type: "High Spending Spike",
          severity: "high",
          user: userMap[tx.user_id] || "Unknown",
          message: `Single transaction of Rp ${amount.toLocaleString("id-ID")} recorded.`,
          date: tx.date
        });
      }
    });

    // Check for suspicious volume (e.g., >= 5 transactions in one day by one user)
    const txByDateAndUser: Record<string, Record<string, number>> = {};
    transactions?.forEach(tx => {
      if (!txByDateAndUser[tx.date]) txByDateAndUser[tx.date] = {};
      txByDateAndUser[tx.date][tx.user_id] = (txByDateAndUser[tx.date][tx.user_id] || 0) + 1;
    });

    Object.entries(txByDateAndUser).forEach(([date, usersTx]) => {
      Object.entries(usersTx).forEach(([userId, count]) => {
        if (count >= 5) {
          alerts.push({
            id: `suspicious-${userId}-${date}`,
            type: "Suspicious Transactions",
            severity: "medium",
            user: userMap[userId] || "Unknown",
            message: `${count} transactions recorded on a single day.`,
            date: date
          });
        }
      });
    });

    return { success: true, alerts: alerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch risk alerts" };
  }
}
