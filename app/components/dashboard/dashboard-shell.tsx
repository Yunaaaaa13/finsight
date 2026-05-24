"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Activity, Sparkles, CalendarDays, Plus, Upload, Loader2, LayoutDashboard, Wallet, BarChart3, User, Home, Download, Target, Settings, Globe } from "lucide-react";
import { CashflowChart } from "@/app/components/dashboard/cashflow-chart";
import { Sidebar } from "@/app/components/dashboard/sidebar";
import { SummaryCard } from "@/app/components/dashboard/summary-card";
import { TopCategories } from "@/app/components/dashboard/top-categories";
import { TransactionTable } from "@/app/components/dashboard/transaction-table";
import { TransactionForm } from "@/app/components/dashboard/transaction-form";
import { DeleteDialog } from "@/app/components/dashboard/delete-dialog";
import { CSVUpload } from "@/app/components/dashboard/csv-upload";
import { AnalyticsView } from "@/app/components/dashboard/analytics/analytics-view";
import { FinancialHealthCard } from "@/app/components/dashboard/financial-health";
import { ProfileView } from "@/app/components/dashboard/profile/profile-view";
import { RealTimeClock, RealTimeClockCompact } from "@/app/components/dashboard/real-time-clock";
import { SettingsView } from "@/app/components/dashboard/settings/settings-view";
import { BudgetView } from "@/app/components/dashboard/budget/budget-view";
import { ExportData } from "@/app/components/dashboard/export-data";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactionsFromCSV,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useCurrency } from "@/app/hooks/use-currency";

// ─── Helpers ─────────────────────────────────────

function computeSummary(
  txs: Transaction[],
  convertFromIDR: (amt: number) => number,
  formatCurrency: (amt: number, cur: string) => string,
  baseCurrency: string
) {
  const now = new Date();
  const thisMonth = txs.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Calculate sum in IDR (which is stored in amount_base or amount)
  const incomeIDR = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + (t.amount_base ?? t.amount), 0);
  const expenseIDR = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + (t.amount_base ?? t.amount), 0);
  const balanceIDR = incomeIDR - expenseIDR;
  const savingsRatio = incomeIDR > 0 ? Math.round((balanceIDR / incomeIDR) * 100) : 0;

  return [
    {
      label: "Pemasukan",
      value: formatCurrency(convertFromIDR(incomeIDR), baseCurrency),
      delta: "+0%",
      accent: "text-emerald-600",
    },
    {
      label: "Pengeluaran",
      value: formatCurrency(convertFromIDR(expenseIDR), baseCurrency),
      delta: "-0%",
      accent: "text-rose-500",
    },
    {
      label: "Sisa Saldo",
      value: formatCurrency(convertFromIDR(balanceIDR), baseCurrency),
      delta: balanceIDR >= 0 ? "+aktif" : "-defisit",
      accent: balanceIDR >= 0 ? "text-sky-600" : "text-rose-500",
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
    weeks[week] += (t.amount_base ?? t.amount) * sign;
  });

  return Object.entries(weeks).map(([w, value]) => ({
    label: `Minggu ${w}`,
    value: Math.abs(value),
  }));
}

// ─── Default data for empty state ────────────────

const defaultSummary = [
  { label: "Pemasukan", value: "Rp 0", delta: "+0%", accent: "text-emerald-600" },
  { label: "Pengeluaran", value: "Rp 0", delta: "-0%", accent: "text-rose-500" },
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

function loadBudgets() {
  if (typeof window === "undefined") return { budgets: [] };
  const now = new Date();
  const key = `finsight_budget_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch { /* ignore */ }
  }
  return { budgets: [] };
}

// ─── Component ───────────────────────────────────

export function DashboardShell() {
  const [activeView, setActiveView] = useState<"dashboard" | "transactions" | "analytics" | "profile" | "settings" | "budget">("dashboard");

  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
      setFullName(data?.user?.user_metadata?.full_name ?? null);
    });
  }, [supabase.auth]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("Memuat data...");
  const [budgets, setBudgets] = useState<any[]>([]);

  // Currency Hook
  const { baseCurrency, SUPPORTED_CURRENCIES, rates, changeCurrency, convertFromIDR, formatCurrency, isLoading: currencyLoading } = useCurrency();

  useEffect(() => {
    const data = loadBudgets();
    setBudgets(data.budgets || []);
  }, [activeView]);

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [showExport, setShowExport] = useState(false);

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
  const summary = transactions.length > 0 
    ? computeSummary(transactions, convertFromIDR, formatCurrency, baseCurrency) 
    : [
        { label: "Pemasukan", value: formatCurrency(0, baseCurrency), delta: "+0%", accent: "text-emerald-600" },
        { label: "Pengeluaran", value: formatCurrency(0, baseCurrency), delta: "-0%", accent: "text-rose-500" },
        { label: "Sisa Saldo", value: formatCurrency(0, baseCurrency), delta: "+aktif", accent: "text-sky-600" },
        { label: "Rasio Tabungan", value: "0%", delta: "perlu hemat", accent: "text-amber-600" },
      ];
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
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 pb-24 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-10 lg:pb-8">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <main className="space-y-6 min-w-0">
          {/* Header */}
          <section className="rounded-2xl border border-border bg-card p-6 card-glow animate-float-in overflow-hidden relative">
            <div className="absolute -right-20 -top-20 size-60 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-chart-3/5 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-3">
                  <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1 text-xs font-medium hover:bg-muted hover:text-foreground transition-all mr-1 border border-border/50">
                    <Home className="size-3" />
                    <span>Beranda</span>
                  </Link>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    <p className="text-xs font-medium">{dateStr}</p>
                  </div>
                  <RealTimeClockCompact />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {fullName ? `Halo, ${fullName}! 👋` : (userEmail ? `Halo, ${userEmail.split("@")[0]}! 👋` : "FinSight Dashboard")}
                </h1>
                
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 font-medium">
                    Masuk: {summary[0].value}
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 font-medium">
                    Keluar: {summary[1].value}
                  </div>
                  <div className="bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-lg text-sky-600 dark:text-sky-400 font-medium">
                    Sisa: {summary[2].value}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-muted/50 backdrop-blur-sm px-3.5 py-2 text-xs font-medium text-muted-foreground border border-border/50">
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
                
                <div className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-muted/50 backdrop-blur-sm px-3.5 py-2 text-xs font-medium text-muted-foreground border border-border/50">
                  <Sparkles className="size-3.5 text-primary" />
                  <span>{status}</span>
                </div>
              </div>
            </div>
          </section>

          {activeView === "dashboard" ? (
            <div className="space-y-6 animate-float-in">
              {/* Real-Time Clock & Financial Reminder Widget */}
              <RealTimeClock />

              {/* Quick Actions (Baru) */}
              <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 animate-float-in" style={{ animationDelay: "100ms" }}>
                <button 
                  onClick={() => { setEditingTx(null); setShowForm(true); }} 
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5 hover:bg-muted/50 hover:border-primary/50 transition-all card-glow group"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                    <Plus className="size-6 text-emerald-500" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Catat Transaksi</span>
                </button>
                
                <button 
                  onClick={() => setActiveView("budget")} 
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5 hover:bg-muted/50 hover:border-amber-500/50 transition-all card-glow group"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                    <Target className="size-6 text-amber-500" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Kelola Anggaran</span>
                </button>

                <button 
                  onClick={() => setShowExport(true)} 
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5 hover:bg-muted/50 hover:border-sky-500/50 transition-all card-glow group"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-sky-500/10 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all">
                    <Download className="size-6 text-sky-500" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Export Laporan</span>
                </button>

                <button 
                  onClick={() => setActiveView("profile")} 
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5 hover:bg-muted/50 hover:border-violet-500/50 transition-all card-glow group"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-violet-500/10 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all">
                    <User className="size-6 text-violet-500" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Profil Pintar</span>
                </button>
              </section>

              {/* Summary cards */}
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 animate-float-in" style={{ animationDelay: "200ms" }}>
                {summary.map((item, index) => (
                  <SummaryCard key={item.label} {...item} index={index} />
                ))}
              </section>

              {/* Financial Health Score */}
              <section className="animate-float-in" style={{ animationDelay: "300ms" }}>
                <FinancialHealthCard transactions={transactions} />
              </section>

              {/* Charts row */}
              <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr] animate-float-in" style={{ animationDelay: "400ms" }}>
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

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShowExport(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                    >
                      <Download className="size-3.5" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                    <button
                      onClick={() => setShowCSVUpload(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                    >
                      <Upload className="size-3.5" />
                      <span className="hidden sm:inline">Import</span>
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

                {/* Budget Awareness */}
                {budgets.length > 0 && (
                  <div className="mb-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {budgets.slice(0, 3).map((b, i) => {
                      const spent = transactions
                        .filter(t => {
                          const d = new Date(t.date);
                          const now = new Date();
                          return t.category === b.category && t.type === "expense" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                        })
                        .reduce((sum, t) => sum + t.amount, 0);
                      const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
                      const isOver = percent >= 100;
                      const isWarning = percent >= 80 && percent < 100;
                      
                      return (
                        <div key={i} className={`rounded-xl border p-3 ${isOver ? 'bg-rose-500/5 border-rose-500/20' : isWarning ? 'bg-amber-500/5 border-amber-500/20' : 'bg-muted/30 border-border'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-foreground">{b.category}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isOver ? 'bg-rose-500/10 text-rose-500' : isWarning ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                              {isOver ? 'Melebihi' : isWarning ? 'Hampir Limit' : 'Aman'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-1.5">
                            <div className={`h-full ${isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, percent)}%` }} />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                            <span>{percent}%</span>
                            <span>Rp {b.limit.toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

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
                    baseCurrency={baseCurrency}
                    formatCurrency={formatCurrency}
                    convertFromIDR={convertFromIDR}
                  />
                )}
              </section>
            </div>
          ) : activeView === "analytics" ? (
            <AnalyticsView transactions={transactions} />
          ) : activeView === "budget" ? (
            <BudgetView transactions={transactions} />
          ) : activeView === "profile" ? (
            <ProfileView transactions={transactions} />
          ) : activeView === "settings" ? (
            <SettingsView />
          ) : null}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden pb-safe overflow-x-auto gap-2">
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Home" },
          { id: "transactions", icon: Wallet, label: "Catatan" },
          { id: "budget", icon: Target, label: "Anggaran" },
          { id: "analytics", icon: BarChart3, label: "Analitik" },
          { id: "profile", icon: User, label: "Profil" },
          { id: "settings", icon: Settings, label: "Pengaturan" },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`flex size-9 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive ? "bg-primary/10 shadow-sm" : ""
                }`}
              >
                <Icon className={`size-[18px] ${isActive ? "scale-110" : ""}`} />
              </div>
              <span className={`text-[9px] font-medium ${isActive ? "opacity-100" : "opacity-80"} whitespace-nowrap`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

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

      {showExport && (
        <ExportData
          transactions={transactions}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
