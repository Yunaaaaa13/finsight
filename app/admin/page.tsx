import { getPlatformAnalytics, getRiskAlerts } from "@/app/admin/actions";
import { Users, Activity, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, CreditCard, Target, PieChart } from "lucide-react";
import { AdminCharts } from "./admin-charts";
import { AdminClock } from "@/app/components/admin/admin-clock";
import { AdminDashboardClient } from "./admin-dashboard-client";

export const metadata = {
  title: "Admin Analytics | FinSight",
  description: "Platform analytics dashboard for admins.",
};

export default async function AdminAnalyticsPage() {
  const [analyticsRes, alertsRes] = await Promise.all([
    getPlatformAnalytics(),
    getRiskAlerts()
  ]);

  if (!analyticsRes.success || !analyticsRes.data) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load analytics: {analyticsRes.error}
      </div>
    );
  }

  const { 
    totalUsers, 
    activeUsers, 
    totalTransactionsAmount, 
    monthlyGrowth, 
    categoryBreakdown,
    behaviorAnalytics,
    chartData,
    insights
  } = analyticsRes.data;
  
  const alerts = alertsRes.success ? alertsRes.alerts || [] : [];

  return (
    <AdminDashboardClient data={analyticsRes.data} alerts={alerts} />
  );
}
