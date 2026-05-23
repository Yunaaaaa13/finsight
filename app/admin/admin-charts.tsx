"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartData {
  month: string;
  newUsers: number;
  totalUsers: number;
  volume: number;
}

export function AdminCharts({ data }: { data: ChartData[] }) {
  // We need to reverse data because we pushed it from most recent to oldest in actions.ts,
  // wait, the loop was `for (let i = 5; i >= 0; i--)` so it is already chronological!
  
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* User Growth Chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          👥 User Growth Trend
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 500 }} 
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

      {/* Transaction Growth Chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-glow">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          💳 Transaction Volume Trend
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 500 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return value % 1000000 === 0 ? `Rp${value / 1000000} Jt` : `Rp${(value / 1000000).toFixed(1)} Jt`;
                  }
                  if (value >= 1000) {
                    return value % 1000 === 0 ? `Rp${value / 1000} Rb` : `Rp${(value / 1000).toFixed(0)} Rb`;
                  }
                  return `Rp${value}`;
                }}
                width={70}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", color: "hsl(var(--foreground))" }}
                formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString("id-ID")}`, "Volume"]}
              />
              <Bar dataKey="volume" name="Volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
