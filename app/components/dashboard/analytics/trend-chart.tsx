"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import type { Transaction } from "@/lib/types";

export function TrendChart({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    // Get last 30 days of data
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group by date
    const dailyMap: Record<string, { income: number; expense: number }> = {};
    
    sorted.forEach((tx) => {
      if (!dailyMap[tx.date]) {
        dailyMap[tx.date] = { income: 0, expense: 0 };
      }
      if (tx.type === "income") dailyMap[tx.date].income += tx.amount;
      else dailyMap[tx.date].expense += tx.amount;
    });

    let cumulativeBalance = 0;
    const chartData = Object.entries(dailyMap).map(([date, vals]) => {
      cumulativeBalance += (vals.income - vals.expense);
      return {
        date: new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        pemasukan: vals.income,
        pengeluaran: vals.expense,
        saldo: cumulativeBalance,
      };
    });

    // Return the last 30 active days
    return chartData.slice(-30);
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}Jt` : `${(value / 1000).toFixed(0)}Rb`}
          width={50}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", fontSize: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
          itemStyle={{ fontWeight: "600" }}
          formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`]}
        />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
        <Area
          type="monotone"
          dataKey="saldo"
          name="Saldo (Akumulasi)"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorBalance)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="pemasukan"
          name="Pemasukan"
          stroke="#10b981"
          fillOpacity={1}
          fill="url(#colorIncome)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="pengeluaran"
          name="Pengeluaran"
          stroke="#f43f5e"
          fillOpacity={1}
          fill="url(#colorExpense)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
