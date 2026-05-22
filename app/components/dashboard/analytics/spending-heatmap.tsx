"use client";

import { useMemo } from "react";
import type { Transaction } from "@/lib/types";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const WEEKS = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5"];

export function SpendingHeatmap({ transactions }: { transactions: Transaction[] }) {
  // Only look at current month's expenses
  const heatmapData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const expenses = transactions.filter((t) => {
      if (t.type !== "expense") return false;
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Create matrix [week][day]
    // week 0-4, day 0-6 (Mon=0)
    const matrix: number[][] = Array(5).fill(0).map(() => Array(7).fill(0));
    let maxAmount = 0;

    expenses.forEach((tx) => {
      const d = new Date(tx.date);
      let dayOfWeek = d.getDay(); // 0=Sun, 1=Mon...
      // Convert to 0=Mon, 6=Sun
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      
      const dayOfMonth = d.getDate();
      const weekOfMonth = Math.min(4, Math.floor((dayOfMonth - 1) / 7));

      matrix[weekOfMonth][dayOfWeek] += tx.amount;
      if (matrix[weekOfMonth][dayOfWeek] > maxAmount) {
        maxAmount = matrix[weekOfMonth][dayOfWeek];
      }
    });

    return { matrix, maxAmount };
  }, [transactions]);

  function getColorClass(amount: number, max: number) {
    if (amount === 0) return "bg-muted/30";
    const ratio = amount / max;
    if (ratio < 0.2) return "bg-rose-500/20";
    if (ratio < 0.4) return "bg-rose-500/40";
    if (ratio < 0.6) return "bg-rose-500/60";
    if (ratio < 0.8) return "bg-rose-500/80";
    return "bg-rose-500";
  }

  return (
    <div className="w-full overflow-x-auto pb-2 flex-1 flex flex-col justify-center">
      <div className="min-w-[400px]">
        {/* Header Days */}
        <div className="grid grid-cols-8 gap-2 mb-2">
          <div className="w-12"></div> {/* Empty corner */}
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {d.slice(0, 3)}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="space-y-2">
          {WEEKS.map((w, weekIdx) => (
            <div key={w} className="grid grid-cols-8 gap-2 items-center">
              <div className="text-[10px] font-semibold text-muted-foreground whitespace-nowrap w-12 text-right pr-2">
                Mg {weekIdx + 1}
              </div>
              {DAYS.map((_, dayIdx) => {
                const amount = heatmapData.matrix[weekIdx][dayIdx];
                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className="relative group w-full pt-[100%] rounded-md cursor-pointer transition-transform hover:scale-110"
                  >
                    <div className={`absolute inset-0 rounded-md border border-border/20 ${getColorClass(amount, heatmapData.maxAmount)}`} />
                    
                    {/* Tooltip */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-10 w-max bg-card border border-border rounded-lg shadow-xl px-3 py-2 text-xs">
                      <p className="font-bold text-foreground">
                        {DAYS[dayIdx]}, {WEEKS[weekIdx]}
                      </p>
                      <p className="text-rose-500 font-medium">
                        {amount === 0 ? "Tidak ada pengeluaran" : `Rp ${amount.toLocaleString("id-ID")}`}
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-border" />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-6 text-[10px] text-muted-foreground">
          <span>Sedikit</span>
          <div className="flex gap-1">
            <div className="size-3 rounded-sm bg-muted/30" />
            <div className="size-3 rounded-sm bg-rose-500/20" />
            <div className="size-3 rounded-sm bg-rose-500/40" />
            <div className="size-3 rounded-sm bg-rose-500/60" />
            <div className="size-3 rounded-sm bg-rose-500/80" />
            <div className="size-3 rounded-sm bg-rose-500" />
          </div>
          <span>Banyak</span>
        </div>
      </div>
    </div>
  );
}
