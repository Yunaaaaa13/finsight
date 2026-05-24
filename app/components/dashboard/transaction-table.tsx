"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Pencil,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Car,
  Receipt,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  TrendingUp,
  Briefcase,
  Gift,
  Wallet,
  MoreHorizontal,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import type { Transaction, TransactionType } from "@/lib/types";
import { CATEGORIES, PAYMENT_METHODS } from "@/lib/types";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const ITEMS_PER_PAGE = 8;

const categoryIcons: Record<string, LucideIcon> = {
  "Makanan & Minuman": ShoppingCart,
  Transportasi: Car,
  Tagihan: Receipt,
  Hiburan: Gamepad2,
  Kesehatan: HeartPulse,
  Pendidikan: GraduationCap,
  Investasi: TrendingUp,
  Bisnis: Briefcase,
  Hadiah: Gift,
  Gaji: Wallet,
  Freelance: CreditCard,
  Belanja: ShoppingCart,
};

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...transactions];

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.title.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.payment_method.toLowerCase().includes(q)
      );
    }

    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter((tx) => tx.type === typeFilter);
    }
    
    // Filter by Category
    if (categoryFilter !== "all") {
      result = result.filter((tx) => tx.category === categoryFilter);
    }
    
    // Filter by Payment Method
    if (methodFilter !== "all") {
      result = result.filter((tx) => tx.payment_method === methodFilter);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [transactions, search, typeFilter, categoryFilter, methodFilter, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-muted/30 p-3 text-center">
          <p className="text-[0.65rem] font-medium text-muted-foreground">Total Transaksi</p>
          <p className="text-lg font-bold text-foreground">{transactions.length}</p>
        </div>
        <div className="rounded-xl bg-emerald-500/5 p-3 text-center">
          <p className="text-[0.65rem] font-medium text-muted-foreground">Pemasukan</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            Rp {totalIncome.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-xl bg-rose-500/5 p-3 text-center">
          <p className="text-[0.65rem] font-medium text-muted-foreground">Pengeluaran</p>
          <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
            Rp {totalExpense.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col gap-3">
        {/* Top Row: Search & Type */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari transaksi..."
              className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div className="flex gap-1 p-1 rounded-xl bg-muted/40 self-start sm:self-auto shrink-0">
            {([
              { value: "all" as const, label: "Semua" },
              { value: "income" as const, label: "Masuk" },
              { value: "expense" as const, label: "Keluar" },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setTypeFilter(opt.value); setPage(1); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  typeFilter === opt.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Bottom Row: Additional Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={methodFilter}
            onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="all">Semua Metode</option>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-muted/10">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/50 mb-4 shadow-sm">
            <Receipt className="size-7 text-muted-foreground/60" />
          </div>
          <p className="text-base font-semibold text-foreground">
            {transactions.length === 0 ? "Belum ada transaksi 📭" : "Tidak ada hasil"}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">
            {transactions.length === 0
              ? "Mulai catat pengeluaran Anda untuk memahami kebiasaan finansial."
              : "Coba ubah filter atau kata kunci pencarian Anda."}
          </p>
          {transactions.length === 0 && (
            <p className="mt-4 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
              Tekan tombol + Tambah di atas
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      <button
                        onClick={() => setSortAsc(!sortAsc)}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Tanggal
                        <ArrowUpDown className="size-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Transaksi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Metode</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Jumlah</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground w-[70px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map((tx) => {
                    const IconComp = categoryIcons[tx.category] ?? Receipt;
                    
                    // Parse Multi-Currency Title
                    let displayTitle = tx.title;
                    let originalCurrencyText = null;

                    const match = tx.title.match(/^\[([A-Z]{3})\s+([0-9.,]+)\]\s*(.*)$/);
                    if (match) {
                      originalCurrencyText = `${match[1]} ${match[2]}`;
                      displayTitle = match[3] || "Transaksi";
                    }

                    return (
                      <tr key={tx.id} className="group hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(tx.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                              tx.type === "income"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-rose-500/10 text-rose-500"
                            }`}>
                              <IconComp className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{displayTitle}</p>
                              {originalCurrencyText && (
                                <p className="text-[10px] text-muted-foreground bg-muted/50 w-fit px-1.5 py-0.5 rounded mt-0.5 border border-border/40 font-medium">
                                  {originalCurrencyText}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground md:hidden mt-0.5">{tx.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground">{tx.category}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">{tx.payment_method}</span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {originalCurrencyText ? (
                            <div className="flex flex-col items-end">
                              <span className={`text-sm font-semibold tabular-nums ${
                                tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                              }`}>
                                {tx.type === "income" ? "+" : "-"}{originalCurrencyText}
                              </span>
                              <span className="text-[10px] font-medium text-muted-foreground/70">
                                (~Rp {tx.amount.toLocaleString("id-ID")})
                              </span>
                            </div>
                          ) : (
                            <span className={`text-sm font-semibold tabular-nums ${
                              tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                            }`}>
                              {tx.type === "income" ? "+" : "-"}Rp {tx.amount.toLocaleString("id-ID")}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEdit(tx)}
                              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="Edit"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(tx)}
                              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  disabled={safePage <= 1}
                  className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      p === safePage
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage >= totalPages}
                  className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
