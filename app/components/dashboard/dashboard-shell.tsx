"use client";

import { useEffect, useState, useCallback } from "react";
import { Activity, Sparkles, CalendarDays, Plus, Upload, Loader2, LayoutDashboard, Wallet } from "lucide-react";
import { CashflowChart } from "@/app/components/dashboard/cashflow-chart";
import { Sidebar } from "@/app/components/dashboard/sidebar";
import { SummaryCard } from "@/app/components/dashboard/summary-card";
import { TopCategories } from "@/app/components/dashboard/top-categories";
import { TransactionTable } from "@/app/components/dashboard/transaction-table";
import { TransactionForm } from "@/app/components/dashboard/transaction-form";
import { DeleteDialog } from "@/app/components/dashboard/delete-dialog";
import { CSVUpload } from "@/app/components/dashboard/csv-upload";
import { AnalyticsView } from "@/app/components/dashboard/analytics/analytics-view";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactionsFromCSV,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

// ─── Helpers ─────────────────────────────────────

function computeSummary(txs: Transaction[]) {
  const now = new Date();
  const thisMonth = txs.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const income = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savingsRatio = income > 0 ? Math.round((balance / income) * 100) : 0;

  return [
    {
      label: "Total Pemasukan Bulan Ini",
      value: `Rp ${income.toLocaleString("id-ID")}`,
      delta: "+0%",
      accent: "text-emerald-600",
    },
    {
      label: "Total Pengeluaran",
      value: `Rp ${expense.toLocaleString("id-ID")}`,
      delta: "-0%",
      accent: "text-rose-500",
    },
    {
      label: "Sisa Saldo",
      value: `Rp ${balance.toLocaleString("id-ID")}`,
      delta: balance >= 0 ? "+aktif" : "-defisit",
      accent: balance >= 0 ? "text-sky-600" : "text-rose-500",
    },
    {
      label: "Rasio Tabungan",
      value: `${savingsRatio}%`,
      delta: savingsRatio >= 50 ? "+baik" : "perlu hemat",
      accent: savingsRatio >= 50 ? "text-violet-600" : "text-amber-600",
    },
  ];
}

function computeTopCategories(txs: Transaction[]) {
  const now = new Date();
  const thisMonth = txs.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === "expense";
  });

  const byCategory: Record<string, number> = {};
  thisMonth.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
  });

  const total = Object.values(byCategory).reduce((s, v) => s + v, 0);
  return Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({
      category,
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    }));
}

function computeCashflow(txs: Transaction[]) {
  const now = new Date();
  const thisMonth = txs.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Group by week of month
  const weeks: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  thisMonth.forEach((t) => {
    const day = new Date(t.date).getDate();
    const week = Math.min(5, Math.ceil(day / 7));
    const sign = t.type === "income" ? 1 : -1;
    weeks[week] += t.amount * sign;
  });

  return Object.entries(weeks).map(([w, value]) => ({
    label: `Minggu ${w}`,
    value: Math.abs(value),
  }));
}

// ─── Default data for empty state ────────────────

const defaultSummary = [
  { label: "Total Pemasukan Bulan Ini", value: "Rp 0", delta: "+0%", accent: "text-emerald-600" },
  { label: "Total Pengeluaran", value: "Rp 0", delta: "-0%", accent: "text-rose-500" },
  { label: "Sisa Saldo", value: "Rp 0", delta: "+aktif", accent: "text-sky-600" },
  { label: "Rasio Tabungan", value: "0%", delta: "perlu hemat", accent: "text-amber-600" },
];

const defaultCashflow = [
  { label: "Minggu 1", value: 0 },
  { label: "Minggu 2", value: 0 },
  { label: "Minggu 3", value: 0 },
  { label: "Minggu 4", value: 0 },
  { label: "Minggu 5", value: 0 },
];

// ─── Component ───────────────────────────────────

export function DashboardShell() {
  const [activeView, setActiveView] = useState<"dashboard" | "transactions" | "analytics">("dashboard");

  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
    });
  }, [supabase.auth]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("Memuat data...");

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [showCSVUpload, setShowCSVUpload] = useState(false);

  // Load transactions
  const loadTransactions = useCallback(async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
      setStatus(`${data.length} transaksi dimuat`);
    } catch {
      setStatus("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // CRUD handlers
  async function handleAddOrUpdate(data: Omit<Transaction, "id" | "created_at">) {
    if (editingTx) {
      const updated = await updateTransaction(editingTx.id, data);
      if (updated) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === editingTx.id ? updated : t))
        );
      }
    } else {
      const added = await addTransaction(data);
      if (added) {
        setTransactions((prev) => [added, ...prev]);
      }
    }
    setShowForm(false);
    setEditingTx(null);
  }

  async function handleDelete() {
    if (!deletingTx) return;
    const success = await deleteTransaction(deletingTx.id);
    if (success) {
      setTransactions((prev) => prev.filter((t) => t.id !== deletingTx.id));
    }
    setDeletingTx(null);
  }

  async function handleCSVImport(data: Omit<Transaction, "id" | "created_at">[]) {
    // Use Supabase batch insert
    const { supabase } = await import("@/lib/supabase");
    const { data: inserted, error } = await supabase
      .from("transactions")
      .insert(data)
      .select();

    if (!error && inserted) {
      setTransactions((prev) => [...inserted, ...prev]);
      setStatus(`${inserted.length} transaksi diimport`);
    }
    setShowCSVUpload(false);
  }

  // Computed data
  const summary = transactions.length > 0 ? computeSummary(transactions) : defaultSummary;
  const topCategories = transactions.length > 0 ? computeTopCategories(transactions) : [];
  const cashflowPoints = transactions.length > 0 ? computeCashflow(transactions) : defaultCashflow;

  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-10">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <main className="space-y-6 min-w-0">
          {/* Header */}
          <section className="rounded-2xl border border-border bg-card p-6 card-glow animate-float-in overflow-hidden relative">
            <div className="absolute -right-20 -top-20 size-60 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-chart-3/5 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <CalendarDays className="size-3.5" />
                  <p className="text-xs font-medium">{dateStr}</p>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {userEmail ? `Halo, ${userEmail.split("@")[0]}! 👋` : "Finsight Dashboard"}
                </h1>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Selamat datang kembali! Berikut adalah ringkasan keuangan Anda hari ini.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-muted/50 backdrop-blur-sm px-3.5 py-2 text-xs font-medium text-muted-foreground border border-border/50">
                  <Sparkles className="size-3.5 text-primary" />
                  <span>{status}</span>
                </div>
              </div>
            </div>
          </section>

          {activeView === "dashboard" ? (
            <div className="space-y-6 animate-float-in">
              {/* Summary cards */}
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summary.map((item, index) => (
                  <SummaryCard key={item.label} {...item} index={index} />
                ))}
              </section>

              {/* Charts row */}
              <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <CashflowChart points={cashflowPoints} />
                <TopCategories categories={topCategories} />
              </section>
            </div>
          ) : activeView === "transactions" ? (
            <div className="animate-float-in">
              {/* Transactions section */}
              <section
                id="transactions"
                className="rounded-2xl border border-border bg-card p-6 card-glow"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-400/15">
                      <Activity className="size-[18px] text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Manajemen Transaksi</p>
                      <h2 className="text-lg font-bold text-foreground">Semua Transaksi</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCSVUpload(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                    >
                      <Upload className="size-3.5" />
                      Upload CSV
                    </button>
                    <button
                      onClick={() => { setEditingTx(null); setShowForm(true); }}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                    >
                      <Plus className="size-3.5" />
                      Tambah
                    </button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16 gap-2">
                    <Loader2 className="size-5 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Memuat transaksi...</p>
                  </div>
                ) : (
                  <TransactionTable
                    transactions={transactions}
                    onEdit={(tx) => { setEditingTx(tx); setShowForm(true); }}
                    onDelete={(tx) => setDeletingTx(tx)}
                  />
                )}
              </section>
            </div>
          ) : (
            <AnalyticsView transactions={transactions} />
          )}
        </main>
      </div>

      {/* Modals */}
      {showForm && (
        <TransactionForm
          transaction={editingTx}
          onSave={handleAddOrUpdate}
          onClose={() => { setShowForm(false); setEditingTx(null); }}
        />
      )}

      {deletingTx && (
        <DeleteDialog
          transaction={deletingTx}
          onConfirm={handleDelete}
          onClose={() => setDeletingTx(null)}
        />
      )}

      {showCSVUpload && (
        <CSVUpload
          onImport={handleCSVImport}
          onClose={() => setShowCSVUpload(false)}
        />
      )}
    </div>
  );
}
