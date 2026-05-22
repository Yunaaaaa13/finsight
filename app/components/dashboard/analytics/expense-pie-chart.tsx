"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Transaction } from "@/lib/types";

const COLORS = [
  "#8b5cf6", // violet-500
  "#3b82f6", // blue-500
  "#0ea5e9", // sky-500
  "#10b981", // emerald-500
  "#84cc16", // lime-500
  "#eab308", // yellow-500
  "#f97316", // orange-500
  "#f43f5e", // rose-500
  "#d946ef", // fuchsia-500
];

export function ExpensePieChart({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const categoryMap: Record<string, number> = {};

    expenses.forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Custom label showing percentage for the top 5 slices
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    if (index >= 5 || percent < 0.05) return null; // Only show for top items > 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const RADIAN = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          innerRadius={45}
          fill="#8884d8"
          dataKey="value"
          stroke="hsl(var(--card))"
          strokeWidth={3}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
          contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px", fontSize: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
          itemStyle={{ fontWeight: "bold" }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ fontSize: "11px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
