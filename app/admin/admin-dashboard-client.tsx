"use client";

import { Users, Activity, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, CreditCard, Target, PieChart, Globe } from "lucide-react";
import { AdminCharts } from "./admin-charts";
import { AdminClock } from "@/app/components/admin/admin-clock";
import { useCurrency } from "@/app/hooks/use-currency";

export function AdminDashboardClient({ data, alerts }: { data: any, alerts: any[] }) {
  const { 
    totalUsers, 
    activeUsers, 
    totalTransactionsAmount, 
    monthlyGrowth, 
    categoryBreakdown,
    behaviorAnalytics,
    chartData,
    insights
  } = data;

  const { baseCurrency, SUPPORTED_CURRENCIES, changeCurrency, convertFromIDR, formatCurrency, isLoading: currencyLoading } = useCurrency();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Platform Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Global metrics, growth trends, and user behavior analytics.</p>
        </div>
        <div className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-background/50 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-muted-foreground border border-border/50">
          <Globe className="size-3.5 text-primary" />
          <select
            value={baseCurrency}
            onChange={(e) => changeCurrency(e.target.value)}
            disabled={currencyLoading}
            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-foreground cursor-pointer appearance-none pr-4 outline-none"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            {SUPPORTED_CURRENCIES.map(c => (
              <option key={c} value={c} className="bg-background text-foreground">{c}</option>
            ))}
          </select>
          <span className="-ml-3 pointer-events-none opacity-50">▼</span>
        </div>
      </div>

      {/* Real-Time Clock & Reminder */}
      <AdminClock />

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
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

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
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

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <h3 className="text-2xl font-bold truncate" title={formatCurrency(convertFromIDR(totalTransactionsAmount), baseCurrency)}>
                {formatCurrency(convertFromIDR(totalTransactionsAmount), baseCurrency)}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
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

      {/* Admin Charts from Recharts */}
      {chartData && <AdminCharts data={chartData} />}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Financial Category Analytics */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            💸 Financial Category Analytics
          </h3>
          
          <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3">
            <div className="mt-0.5"><PieChart className="size-5 text-primary" /></div>
            <div>
              <p className="text-sm font-semibold text-primary">Kategori Dominan</p>
              <p className="text-sm text-muted-foreground">{insights?.categoryInsight}</p>
            </div>
          </div>

          <div className="space-y-6">
            {categoryBreakdown && categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((cat: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium capitalize">{cat.name}</span>
                    <span className="font-bold">{cat.percentage}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-sky-500 transition-all duration-1000 ease-out" 
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

        {/* Financial Behavior Analytics */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow flex flex-col">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            🧠 Financial Behavior Analytics
          </h3>
          
          <div className="mb-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20 flex gap-3">
            <div className="mt-0.5"><Target className="size-5 text-violet-500" /></div>
            <div>
              <p className="text-sm font-semibold text-violet-500">Agregat Perilaku</p>
              <p className="text-sm text-muted-foreground">{insights?.behaviorInsight}</p>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            {behaviorAnalytics && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-background">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Avg Saving Ratio</p>
                    <h4 className="text-2xl font-bold text-emerald-500">{behaviorAnalytics.avgSavingRatio}%</h4>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-background">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Avg Expense Ratio</p>
                    <h4 className="text-2xl font-bold text-amber-500">{behaviorAnalytics.avgExpenseRatio}%</h4>
                  </div>
                  <div className="col-span-2 p-4 rounded-xl border border-border bg-background">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Risky Spending Users</p>
                    <div className="flex items-center gap-3">
                      <h4 className="text-2xl font-bold text-red-500">{behaviorAnalytics.riskyUsersPercentage}%</h4>
                      <p className="text-sm text-muted-foreground">dari total pengguna aktif (Pengeluaran &gt; Pemasukan)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3">Overspending Categories (&gt;30%)</p>
                  <div className="flex flex-wrap gap-2">
                    {behaviorAnalytics.overspendingCategories.length > 0 ? (
                      behaviorAnalytics.overspendingCategories.map((cat: string) => (
                        <span key={cat} className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold capitalize border border-red-500/20">
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Tidak ada kategori yang mendominasi pengeluaran.</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Risk Alerts Dashboard */}
      <div className="rounded-2xl border border-red-500/20 bg-card p-6 shadow-sm relative overflow-hidden card-glow">
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
  );
}
