import { getPlatformAnalytics, getRiskAlerts } from "@/app/admin/actions";
import { Users, Activity, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";

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

  const { totalUsers, activeUsers, totalTransactionsAmount, monthlyGrowth, categoryBreakdown } = analyticsRes.data;
  const alerts = alertsRes.success ? alertsRes.alerts || [] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground mt-2">Global metrics and risk monitoring.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{totalUsers}</h3>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users (30d)</p>
              <h3 className="text-2xl font-bold">{activeUsers}</h3>
            </div>
          </div>
        </div>

        {/* Total Volume */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <h3 className="text-2xl font-bold truncate" title={`Rp ${totalTransactionsAmount.toLocaleString("id-ID")}`}>
                Rp {totalTransactionsAmount > 1000000 
                  ? (totalTransactionsAmount / 1000000).toFixed(1) + "M" 
                  : totalTransactionsAmount.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {monthlyGrowth}%
                {monthlyGrowth > 0 ? (
                  <ArrowUpRight className="size-4 text-emerald-500" />
                ) : monthlyGrowth < 0 ? (
                  <ArrowDownRight className="size-4 text-red-500" />
                ) : null}
              </h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Volume growth compared to last month.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            💸 Financial Category Analytics
          </h3>
          <div className="space-y-6">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium capitalize">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No expense data available.</p>
            )}
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="rounded-2xl border border-red-500/20 bg-card p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle className="size-32 text-red-500" />
          </div>
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 relative z-10 text-red-500">
            <AlertTriangle className="size-5" />
            Risk Detection Dashboard
          </h3>
          
          <div className="space-y-4 relative z-10">
            {alerts.length > 0 ? (
              alerts.slice(0, 10).map((alert: any) => (
                <div key={alert.id} className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-border bg-background/50 backdrop-blur-sm">
                  <div className={`mt-1 size-2 rounded-full shrink-0 ${
                    alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      {alert.type}
                      <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                        {new Date(alert.date).toLocaleDateString("id-ID")}
                      </span>
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      User: <span className="font-medium text-foreground">{alert.user}</span>
                    </p>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-emerald-500">
                <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Activity className="size-6" />
                </div>
                <p className="font-medium">All clear</p>
                <p className="text-sm opacity-80 mt-1">No suspicious activities detected.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
