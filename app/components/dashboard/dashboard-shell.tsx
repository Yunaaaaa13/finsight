"use client";

import { useEffect, useState } from "react";
import { Activity, Sparkles } from "lucide-react";
import { CashflowChart } from "@/app/components/dashboard/cashflow-chart";
import { Sidebar } from "@/app/components/dashboard/sidebar";
import { SummaryCard } from "@/app/components/dashboard/summary-card";
import { TopCategories } from "@/app/components/dashboard/top-categories";
import {
  cashflowPoints as defaultCashflowPoints,
  dashboardSummary as defaultSummary,
  topCategories as defaultTopCategories,
} from "@/lib/dashboard-data";

interface SummaryItem {
  label: string;
  value: string;
  delta: string;
  accent: string;
}

interface CashflowPoint {
  label: string;
  value: number;
}

interface TopCategory {
  category: string;
  amount: number;
  percent: number;
}

interface DashboardData {
  summary: SummaryItem[];
  cashflowPoints: CashflowPoint[];
  topCategories: TopCategory[];
  lastUpdated: string;
}

export function DashboardShell() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState("Memuat data terbaru...");

  useEffect(() => {
    let interval: number;

    async function fetchDashboard() {
      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Gagal memuat data API");
        }
        const json = await response.json();
        setData(json);
        setStatus(`Terakhir diperbarui ${new Date(json.lastUpdated).toLocaleTimeString("id-ID")}`);
      } catch (error) {
        setStatus("Tidak dapat memuat data. Coba lagi nanti.");
      }
    }

    fetchDashboard();
    interval = window.setInterval(fetchDashboard, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const summary = data?.summary ?? defaultSummary;
  const cashflowPoints = data?.cashflowPoints ?? defaultCashflowPoints;
  const topCategories = data?.topCategories ?? defaultTopCategories;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[280px_1fr] lg:px-12">
        <Sidebar />

        <main className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Dashboard Analytics</p>
                <h1 className="mt-3 text-4xl font-semibold text-foreground">Ringkasan Keuangan Realtime</h1>
                <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
                  Data diperbarui langsung dari API dan mengikuti preferensi mode gelap otomatis pada perangkat Anda.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-3xl bg-muted/60 px-4 py-3 text-sm text-foreground/90">
                <Sparkles className="size-4" />
                <span>{status}</span>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
            {summary.map((item) => (
              <SummaryCard key={item.label} {...item} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <CashflowChart points={cashflowPoints} />
            <TopCategories categories={topCategories} />
          </section>

          <section id="transactions" className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transaksi Realtime</p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">Aktivitas Terbaru</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <Activity className="size-4" /> Live
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Informasi grafik dan kategori menggunakan data API setiap 15 detik untuk memastikan ringkasan tetap akurat.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
