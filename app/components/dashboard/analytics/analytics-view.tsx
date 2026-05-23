"use client";

import { Activity, PieChart as PieChartIcon, TrendingUp, Calendar } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { TrendChart } from "./trend-chart";
import { ExpensePieChart } from "./expense-pie-chart";
import { SpendingHeatmap } from "./spending-heatmap";

interface AnalyticsViewProps {
  transactions: Transaction[];
}

export function AnalyticsView({ transactions }: AnalyticsViewProps) {
  return (
    <div className="space-y-6 animate-float-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10">
          <Activity className="size-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Analitik Lanjutan</h2>
          <p className="text-xs text-muted-foreground">Wawasan mendalam tentang pola keuangan Anda</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-border bg-card">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50 mb-4">
            <PieChartIcon className="size-7 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-foreground">Belum ada data untuk dianalisis</p>
          <p className="mt-1 text-xs text-muted-foreground">Tambahkan transaksi untuk melihat wawasan analitik.</p>
        </div>
      ) : (
        <>
          {/* Trend Chart (Full Width) */}
            <section className="rounded-2xl border border-border bg-card p-6 card-glow flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="size-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-foreground">Tren Arus Kas (30 Hari Terakhir)</h3>
              </div>
              <div className="flex-1 min-h-[300px] min-w-0 w-full">
                <TrendChart transactions={transactions} />
              </div>
            </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pie Chart */}
            <section className="rounded-2xl border border-border bg-card p-6 card-glow">
              <div className="flex items-center gap-2 mb-6">
                <PieChartIcon className="size-4 text-violet-500" />
                <h3 className="text-sm font-bold text-foreground">Distribusi Pengeluaran</h3>
              </div>
              <div className="h-[300px] min-w-0 min-h-0 w-full">
                <ExpensePieChart transactions={transactions} />
              </div>
            </section>

            {/* Heatmap */}
            <section className="rounded-2xl border border-border bg-card p-6 card-glow flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="size-4 text-rose-500" />
                <h3 className="text-sm font-bold text-foreground">Intensitas Pengeluaran (Bulan Ini)</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0 min-h-[300px] w-full">
                <SpendingHeatmap transactions={transactions} />
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
