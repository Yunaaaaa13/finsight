"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const adminClient = createAdminClient();
  
  const [usersRes, txRes] = await Promise.all([
    adminClient.auth.admin.listUsers(),
    adminClient.from("transactions").select("*")
  ]);
  
  const { data: { users }, error } = usersRes;
  const transactions = txRes.data || [];
  
  if (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message };
  }

  // Calculate time ago helper
  const getTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays === 0 || diffDays === 1) return "today";
    if (diffDays === 2) return "yesterday";
    return `${diffDays} days ago`;
  };

  // Format the users with their financial data
  const formattedUsers = users.map(user => {
    const isBanned = user.banned_until ? new Date(user.banned_until) > new Date() : false;
    
    // Calculate user's specific transactions
    const userTxs = transactions.filter(tx => tx.user_id === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const txCount = userTxs.length;
    let income = 0;
    let expense = 0;
    const currencyCounts: Record<string, number> = {};
    
    userTxs.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") income += amt;
      else if (tx.type === "expense") expense += amt;
      
      const curr = tx.currency || "IDR";
      currencyCounts[curr] = (currencyCounts[curr] || 0) + 1;
    });
    
    const savings = income - expense;
    let preferredCurrency = "IDR";
    let maxCount = 0;
    Object.entries(currencyCounts).forEach(([curr, count]) => {
      if (count > maxCount) {
        maxCount = count;
        preferredCurrency = curr;
      }
    });

    const expenseRatio = income > 0 ? (expense / income) * 100 : (expense > 0 ? 100 : 0);
    const healthScore = Math.max(0, Math.min(100, 100 - (expenseRatio - 50)));

    return {
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Unknown",
      email: user.email || "",
      role: user.app_metadata?.role || "User",
      status: isBanned ? "Suspended" : "Active",
      joined: new Date(user.created_at).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric"
      }),
      lastSignInFull: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("id-ID") : "Never",
      lastSignIn: getTimeAgo(user.last_sign_in_at),
      txCount,
      financials: {
        income,
        expense,
        savings,
        healthScore: Math.round(healthScore)
      },
      preferredCurrency,
      recentTransactions: userTxs.slice(0, 5).map(tx => ({
        id: tx.id,
        title: tx.title,
        amount: Number(tx.amount),
        type: tx.type,
        date: tx.date,
        currency: tx.currency || "IDR"
      }))
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

    // Analytics Extra Metrics
    let totalIncome = 0;
    let totalExpenseAmount = 0;
    const currencyUsage: Record<string, number> = {};
    const transactionsByDate: Record<string, number> = {};

    transactions?.forEach(tx => {
      const amount = Number(tx.amount) || 0;
      if (tx.type === "income") totalIncome += amount;
      if (tx.type === "expense") totalExpenseAmount += amount;
      
      const curr = tx.currency || "IDR";
      currencyUsage[curr] = (currencyUsage[curr] || 0) + 1;

      // Group by day for the last 14 days
      const d = new Date(tx.date).toISOString().split('T')[0];
      transactionsByDate[d] = (transactionsByDate[d] || 0) + 1;
    });
    
    
    let mostUsedCurrency = "IDR";
    let maxCurrCount = 0;
    Object.entries(currencyUsage).forEach(([curr, count]) => {
      if (count > maxCurrCount) {
        maxCurrCount = count;
        mostUsedCurrency = curr;
      }
    });

    // Category breakdown (expenses only)
    const expenses = transactions?.filter(tx => tx.type === "expense") || [];
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(tx => {
      const amount = Number(tx.amount) || 0;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amount;
    });

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenseAmount > 0 ? Math.round((amount / totalExpenseAmount) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Behavior Analytics
    const userFinancials: Record<string, { income: number; expense: number }> = {};
    users.forEach(u => userFinancials[u.id] = { income: 0, expense: 0 });
    transactions?.forEach(tx => {
      const amount = Number(tx.amount) || 0;
      if (userFinancials[tx.user_id]) {
        if (tx.type === "income") userFinancials[tx.user_id].income += amount;
        else if (tx.type === "expense") userFinancials[tx.user_id].expense += amount;
      }
    });

    let totalSavingRatio = 0;
    let totalExpenseRatio = 0;
    let usersWithData = 0;
    let riskyUsersCount = 0;

    Object.values(userFinancials).forEach(fin => {
      if (fin.income > 0 || fin.expense > 0) {
        usersWithData++;
        if (fin.income > 0) {
          totalSavingRatio += Math.max(0, (fin.income - fin.expense) / fin.income);
          totalExpenseRatio += (fin.expense / fin.income);
        } else {
          totalExpenseRatio += 1;
        }
        if (fin.expense > fin.income) {
          riskyUsersCount++;
        }
      }
    });

    const avgSavingRatio = usersWithData > 0 ? Math.round((totalSavingRatio / usersWithData) * 100) : 0;
    const avgExpenseRatio = usersWithData > 0 ? Math.round((totalExpenseRatio / usersWithData) * 100) : 0;
    const riskyUsersPercentage = usersWithData > 0 ? Math.round((riskyUsersCount / usersWithData) * 100) : 0;
    const overspendingCategories = categoryBreakdown.filter(c => c.percentage > 30).map(c => c.name);

    const behaviorAnalytics = {
      avgSavingRatio,
      avgExpenseRatio,
      overspendingCategories,
      riskyUsersPercentage
    };

    // Chart Data Generation
    const chartData: any = {
      userGrowth: [],
      transactionsPerDay: [],
      currencyDistribution: []
    };
    
    // 1. User Growth (Last 6 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const tempChartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = months[d.getMonth()];
      
      const usersInMonth = users.filter(u => {
        const ud = new Date(u.created_at);
        return ud.getMonth() === d.getMonth() && ud.getFullYear() === d.getFullYear();
      }).length;
      
      const volumeInMonth = transactions?.filter(tx => {
        const td = new Date(tx.date);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      }).reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0;

      tempChartData.push({
        month: monthStr,
        newUsers: usersInMonth,
        volume: volumeInMonth
      });
    }

    let cumulativeUsers = totalUsers - tempChartData.reduce((acc, curr) => acc + curr.newUsers, 0);
    if (cumulativeUsers < 0) cumulativeUsers = 0;
    
    tempChartData.forEach(data => {
      cumulativeUsers += data.newUsers;
      chartData.userGrowth.push({
        ...data,
        totalUsers: cumulativeUsers
      });
    });

    // 2. Transactions Per Day (Last 14 days)
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      chartData.transactionsPerDay.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: transactionsByDate[dateStr] || 0
      });
    }

    // 3. Currency Distribution
    const totalTxCount = transactions?.length || 1;
    chartData.currencyDistribution = Object.entries(currencyUsage).map(([name, value]) => ({
      name,
      value: Math.round((value / totalTxCount) * 100)
    })).sort((a, b) => b.value - a.value);

    // Insights
    let topCategoryInsight = "Belum ada cukup data kategori bulan ini.";
    if (categoryBreakdown.length > 0) {
      const topCat = categoryBreakdown[0].name;
      const topCatCurrent = currentMonthTxs.filter(tx => tx.type === "expense" && tx.category === topCat).reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
      const topCatLast = lastMonthTxs.filter(tx => tx.type === "expense" && tx.category === topCat).reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
      
      if (topCatLast > 0) {
        const increase = Math.round(((topCatCurrent - topCatLast) / topCatLast) * 100);
        if (increase > 0) {
          topCategoryInsight = `Pengeluaran ${topCat} meningkat ${increase}% bulan ini.`;
        } else if (increase < 0) {
          topCategoryInsight = `Pengeluaran ${topCat} turun ${Math.abs(increase)}% bulan ini.`;
        } else {
          topCategoryInsight = `Pengeluaran ${topCat} stabil dibandingkan bulan lalu.`;
        }
      } else if (topCatCurrent > 0) {
        topCategoryInsight = `Pengeluaran ${topCat} melonjak bulan ini.`;
      }
    }

    const insights = {
      categoryInsight: topCategoryInsight,
      behaviorInsight: riskyUsersPercentage > 20 
        ? `${riskyUsersPercentage}% users overspend their income.`
        : `Financial health across platform is stable.`
    };

    return {
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalTransactions: transactions?.length || 0,
        totalTransactionsAmount,
        totalIncome,
        totalExpense: totalExpenseAmount,
        mostUsedCurrency,
        monthlyGrowth,
        categoryBreakdown,
        behaviorAnalytics,
        chartData,
        insights
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
