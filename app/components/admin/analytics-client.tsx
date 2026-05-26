"use client";

import { useCurrency } from "@/app/hooks/use-currency";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, CreditCard, DollarSign,
  BarChart2, Globe, Heart, ShoppingBag, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];
const HEALTH_COLORS: Record<string, string> = {
  Excellent: "#10b981",
  Good: "#3b82f6",
  Fair: "#f59e0b",
  Poor: "#ef4444"
};

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍔", transport: "🚌", shopping: "🛍️", entertainment: "🎬",
  health: "💊", education: "📚", travel: "✈️", utilities: "⚡",
  housing: "🏠", other: "📦"
};

function getCategoryIcon(name: string) {
  return CATEGORY_ICONS[name.toLowerCase()] || "💸";
}

const tooltipStyle = {
  contentStyle: { backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))", fontSize: "12px" },
  itemStyle: { color: "hsl(var(--foreground))" }
};

export function AnalyticsClient({ data }: { data: any }) {
  const { baseCurrency, convertFromIDR, formatCurrency } = useCurrency();

  const {
    userGrowth12m,
    topCategories,
    spendingByMonth,
    currencyAnalytics,
    financialHealthDist,
    totalExpense,
    totalIncome,
    mostUsedCurrency,
    avgTransactionsPerUser,
    totalTransactions,
    totalUsers
  } = data;

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Radar chart data for top 6 categories
  const radarData = topCategories.slice(0, 6).map((c: any) => ({
    category: getCategoryIcon(c.name) + " " + c.name,
    value: c.percentage
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

      {/* ── KPI Summary Row ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Users", value: totalUsers.toLocaleString(),
            sub: `${avgTransactionsPerUser} avg tx/user`,
            icon: Users, color: "blue", trend: null
          },
          {
            label: "Total Transactions", value: totalTransactions.toLocaleString("id-ID"),
            sub: `${avgTransactionsPerUser} per user avg`,
            icon: CreditCard, color: "violet", trend: null
          },
          {
            label: "Total Income", value: formatCurrency(convertFromIDR(totalIncome), baseCurrency),
            sub: `Net: ${formatCurrency(convertFromIDR(netSavings), baseCurrency)}`,
            icon: TrendingUp, color: "emerald", trend: netSavings >= 0 ? "up" : "down"
          },
          {
            label: "Savings Rate", value: `${savingsRate}%`,
            sub: mostUsedCurrency + " most popular",
            icon: Heart, color: "amber", trend: savingsRate >= 30 ? "up" : "down"
          }
        ].map((kpi) => {
          const Icon = kpi.icon;
          const colorMap: Record<string, string> = {
            blue: "bg-blue-500/10 text-blue-500",
            violet: "bg-violet-500/10 text-violet-500",
            emerald: "bg-emerald-500/10 text-emerald-500",
            amber: "bg-amber-500/10 text-amber-500"
          };
          return (
            <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm card-glow flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className={`flex size-10 items-center justify-center rounded-xl ${colorMap[kpi.color]}`}>
                  <Icon className="size-5" />
                </div>
                {kpi.trend && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${kpi.trend === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                    {kpi.trend === "up" ? <ArrowUpRight className="size-3 inline" /> : <ArrowDownRight className="size-3 inline" />}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{kpi.label}</p>
                <p className="text-xl font-bold mt-0.5 truncate" title={kpi.value}>{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── User Growth 12M ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">User Growth</h3>
            <p className="text-xs text-muted-foreground">New registrations vs. total users — last 12 months</p>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowth12m} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="totalUsers" name="Total Users" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gTotal)" />
              <Area type="monotone" dataKey="newUsers" name="New / Month" stroke="#10b981" strokeWidth={2} fill="url(#gNew)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Income vs Expense + Category Radar ─────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income vs Expense bar chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <BarChart2 className="size-4" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Income vs Expense</h3>
              <p className="text-xs text-muted-foreground">6-month platform-wide comparison</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis
                  axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} width={70}
                  tickFormatter={(v) => {
                    const val = convertFromIDR(v);
                    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
                    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
                    return String(val);
                  }}
                />
                <Tooltip {...tooltipStyle} formatter={(v: any) => [formatCurrency(convertFromIDR(Number(v)), baseCurrency)]} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="savings" name="Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Behavior Radar */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <ShoppingBag className="size-4" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Spending Behavior</h3>
              <p className="text-xs text-muted-foreground">Top category share across all users</p>
            </div>
          </div>
          {radarData.length > 0 ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "#888", fontSize: 10 }} />
                  <Radar name="Spending %" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                  <Tooltip {...tooltipStyle} formatter={(v: any) => [`${v}%`, "Share"]} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">No spending data yet.</div>
          )}
        </div>
      </div>

      {/* ── Top Categories Bar ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <DollarSign className="size-4" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Top Spending Categories</h3>
            <p className="text-xs text-muted-foreground">Ranked by total expense volume across all users</p>
          </div>
        </div>
        <div className="space-y-4">
          {topCategories.length > 0 ? topCategories.map((cat: any, i: number) => (
            <div key={cat.name} className="flex items-center gap-4">
              <span className="text-lg w-8 shrink-0 text-center">{getCategoryIcon(cat.name)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium capitalize">{cat.name}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-muted-foreground text-xs">{cat.count} txs</span>
                    <span className="font-bold text-foreground">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${cat.percentage}%`,
                      background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`
                    }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 w-24 text-right truncate" title={formatCurrency(convertFromIDR(cat.amount), baseCurrency)}>
                {formatCurrency(convertFromIDR(cat.amount), baseCurrency)}
              </span>
            </div>
          )) : (
            <p className="text-center text-muted-foreground py-8">No expense data available.</p>
          )}
        </div>
      </div>

      {/* ── Currency Analytics + Financial Health ───────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Currency Analytics */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Globe className="size-4" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Currency Analytics</h3>
              <p className="text-xs text-muted-foreground">Transaction share & volume per currency</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Donut pie */}
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={currencyAnalytics} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="percentage">
                    {currencyAnalytics.map((_: any, index: number) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={(v: any) => [`${v}%`, "Usage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list */}
            <div className="flex flex-col justify-center gap-2">
              {currencyAnalytics.slice(0, 6).map((c: any, i: number) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="font-semibold">{c.name}</span>
                  </div>
                  <span className="font-bold text-muted-foreground">{c.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Currency volume bars */}
          <div className="space-y-3 border-t border-border pt-4">
            {currencyAnalytics.slice(0, 5).map((c: any, i: number) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold w-10 shrink-0" style={{ color: COLORS[i % COLORS.length] }}>{c.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.percentage}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                </div>
                <span className="text-xs text-muted-foreground shrink-0 w-12 text-right">{c.count} txs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Health Distribution */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-9 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
              <Heart className="size-4" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Financial Health Distribution</h3>
              <p className="text-xs text-muted-foreground">Based on each user's expense-to-income ratio</p>
            </div>
          </div>

          {/* Big donut */}
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialHealthDist}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90}
                  paddingAngle={4} dataKey="value"
                  label={({ name, value }) => `${value}%`}
                  labelLine={false}
                >
                  {financialHealthDist.map((entry: any, index: number) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v: any, name: any) => [`${v}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Health legend grid */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            {financialHealthDist.map((h: any) => (
              <div key={h.name} className="flex items-center gap-3 p-3 rounded-xl border border-border" style={{ borderColor: `${h.color}33`, backgroundColor: `${h.color}0D` }}>
                <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold" style={{ color: h.color }}>{h.name}</p>
                  <p className="text-lg font-bold text-foreground">{h.value}%</p>
                  <p className="text-xs text-muted-foreground">{h.count} users</p>
                </div>
              </div>
            ))}
          </div>

          {/* Score legend */}
          <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground space-y-1">
            <p><span className="font-semibold text-emerald-500">Excellent</span>: Expense ≤ 50% of income</p>
            <p><span className="font-semibold text-blue-500">Good</span>: 50–75% | <span className="font-semibold text-amber-500">Fair</span>: 75–100% | <span className="font-semibold text-red-500">Poor</span>: &gt; 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
