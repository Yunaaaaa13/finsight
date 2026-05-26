"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";
import { useCurrency } from "@/app/hooks/use-currency";

interface ChartData {
  userGrowth: { month: string; newUsers: number; totalUsers: number; volume: number; }[];
  transactionsPerDay: { date: string; count: number; }[];
  currencyDistribution: { name: string; value: number; }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

export function AdminCharts({ data }: { data: ChartData }) {
  const { baseCurrency, convertFromIDR, formatCurrency } = useCurrency();
  
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* User Growth Chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          👥 User Growth Trend
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fill: "#888888", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#888888", fontWeight: 500 }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area type="monotone" dataKey="totalUsers" name="Total Users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions per Day Chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          📊 Transactions per Day (Last 14 Days)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.transactionsPerDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fill: "#888888", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#888888", fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="count" name="Count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Volume Trend */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          💳 Transaction Volume Trend
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fill: "#888888", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#888888", fontWeight: 500 }}
                tickFormatter={(val) => {
                  const value = convertFromIDR(val);
                  if (value >= 1000000) {
                    return value % 1000000 === 0 ? `${baseCurrency === 'IDR' ? 'Rp' : baseCurrency} ${value / 1000000} Jt` : `${baseCurrency === 'IDR' ? 'Rp' : baseCurrency} ${(value / 1000000).toFixed(1)} Jt`;
                  }
                  if (value >= 1000) {
                    return value % 1000 === 0 ? `${baseCurrency === 'IDR' ? 'Rp' : baseCurrency} ${value / 1000} Rb` : `${baseCurrency === 'IDR' ? 'Rp' : baseCurrency} ${(value / 1000).toFixed(0)} Rb`;
                  }
                  return formatCurrency(value, baseCurrency);
                }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                formatter={(value: any) => [formatCurrency(convertFromIDR(Number(value || 0)), baseCurrency), "Volume"]}
              />
              <Bar dataKey="volume" name="Volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Currency Distribution */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          🌍 Currency Distribution
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.currencyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.currencyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                formatter={(value: any) => [`${value}%`, "Usage"]}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
