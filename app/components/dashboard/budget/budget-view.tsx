"use client";

import { useState, useEffect, useMemo } from "react";
import { Target, Plus, X, AlertTriangle, CheckCircle2, Edit3, Trash2, PiggyBank } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

interface BudgetViewProps {
  transactions: Transaction[];
}

interface BudgetItem {
  category: string;
  limit: number;
}

interface BudgetData {
  month: string; // "YYYY-MM"
  budgets: BudgetItem[];
}

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function loadBudgets(): BudgetData {
  if (typeof window === "undefined") return { month: getCurrentMonthKey(), budgets: [] };
  const key = `finsight_budget_${getCurrentMonthKey()}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch { /* ignore */ }
  }
  return { month: getCurrentMonthKey(), budgets: [] };
}

function saveBudgets(data: BudgetData) {
  if (typeof window === "undefined") return;
  const key = `finsight_budget_${data.month}`;
  localStorage.setItem(key, JSON.stringify(data));
}

export function BudgetView({ transactions }: BudgetViewProps) {
  const [budgetData, setBudgetData] = useState<BudgetData>({ month: getCurrentMonthKey(), budgets: [] });
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formCategory, setFormCategory] = useState("");
  const [formLimit, setFormLimit] = useState("");

  useEffect(() => {
    setBudgetData(loadBudgets());
  }, []);

  // This month's expenses by category
  const now = new Date();
  const thisMonthExpenses = useMemo(() => {
    const byCategory: Record<string, number> = {};
    transactions
      .filter((t) => {
        const d = new Date(t.date);
        return t.type === "expense" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      });
    return byCategory;
  }, [transactions, now.getMonth(), now.getFullYear()]);

  // Total budget & spending
  const totalBudget = budgetData.budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgetData.budgets.reduce((s, b) => s + (thisMonthExpenses[b.category] || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Available categories (not yet budgeted)
  const expenseCategories = CATEGORIES.filter(c => !["Gaji", "Freelance", "Bisnis", "Hadiah"].includes(c));
  const budgetedCats = new Set(budgetData.budgets.map(b => b.category));
  const availableCategories = expenseCategories.filter(c => !budgetedCats.has(c));

  function handleSaveBudget() {
    if (!formCategory || !formLimit || parseFloat(formLimit) <= 0) return;

    const newBudgets = [...budgetData.budgets];
    if (editIdx !== null) {
      newBudgets[editIdx] = { category: formCategory, limit: parseFloat(formLimit) };
    } else {
      newBudgets.push({ category: formCategory, limit: parseFloat(formLimit) });
    }

    const updated = { ...budgetData, budgets: newBudgets };
    setBudgetData(updated);
    saveBudgets(updated);
    setShowForm(false);
    setEditIdx(null);
    setFormCategory("");
    setFormLimit("");
  }

  function handleDeleteBudget(idx: number) {
    const newBudgets = budgetData.budgets.filter((_, i) => i !== idx);
    const updated = { ...budgetData, budgets: newBudgets };
    setBudgetData(updated);
    saveBudgets(updated);
  }

  function handleEdit(idx: number) {
    setEditIdx(idx);
    setFormCategory(budgetData.budgets[idx].category);
    setFormLimit(budgetData.budgets[idx].limit.toString());
    setShowForm(true);
  }

  function getBarColor(percent: number) {
    if (percent >= 100) return "bg-rose-500";
    if (percent >= 80) return "bg-amber-500";
    return "bg-emerald-500";
  }

  return (
    <div className="space-y-6 animate-float-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="size-6 text-primary" />
            Anggaran Bulanan
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Atur batas pengeluaran per kategori untuk bulan {now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}.
          </p>
        </div>
        <button
          onClick={() => { setEditIdx(null); setFormCategory(availableCategories[0] || ""); setFormLimit(""); setShowForm(true); }}
          disabled={availableCategories.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 shrink-0"
        >
          <Plus className="size-4" />
          Tambah Anggaran
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-glow">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Anggaran</p>
          <p className="text-2xl font-bold text-foreground">Rp {totalBudget.toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-glow">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Sudah Terpakai</p>
          <p className={`text-2xl font-bold ${totalPercent >= 90 ? "text-rose-500" : totalPercent >= 70 ? "text-amber-500" : "text-foreground"}`}>
            Rp {totalSpent.toLocaleString("id-ID")}
          </p>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(totalPercent)} transition-all duration-700 ease-out`} style={{ width: `${Math.min(100, totalPercent)}%` }} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">{totalPercent}% dari total anggaran</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-glow">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Sisa Anggaran</p>
          <p className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            Rp {totalRemaining.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Budget Items */}
      {budgetData.budgets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center card-glow">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
            <PiggyBank className="size-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Anggaran</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            Mulai atur anggaran per kategori untuk mengontrol pengeluaran Anda setiap bulan.
          </p>
          <button
            onClick={() => { setEditIdx(null); setFormCategory(availableCategories[0] || ""); setFormLimit(""); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
          >
            <Plus className="size-4" />
            Buat Anggaran Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {budgetData.budgets.map((budget, idx) => {
            const spent = thisMonthExpenses[budget.category] || 0;
            const remaining = budget.limit - spent;
            const percent = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;
            const isOver = percent >= 100;
            const isWarning = percent >= 80 && percent < 100;

            return (
              <div key={idx} className={`rounded-2xl border bg-card p-5 shadow-sm card-glow transition-all ${
                isOver ? "border-rose-500/30" : isWarning ? "border-amber-500/30" : "border-border"
              }`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-foreground">{budget.category}</h4>
                      {isOver && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                          <AlertTriangle className="size-3" /> Melebihi Batas
                        </span>
                      )}
                      {isWarning && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                          <AlertTriangle className="size-3" /> Hampir Penuh
                        </span>
                      )}
                      {!isOver && !isWarning && percent > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                          <CheckCircle2 className="size-3" /> Aman
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span>Budget: <span className="font-semibold text-foreground">Rp {budget.limit.toLocaleString("id-ID")}</span></span>
                      <span>Terpakai: <span className={`font-semibold ${isOver ? "text-rose-500" : "text-foreground"}`}>Rp {spent.toLocaleString("id-ID")}</span></span>
                      <span>Sisa: <span className={`font-semibold ${remaining >= 0 ? "text-emerald-500" : "text-rose-500"}`}>Rp {remaining.toLocaleString("id-ID")}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEdit(idx)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Edit3 className="size-3.5" />
                    </button>
                    <button onClick={() => handleDeleteBudget(idx)} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getBarColor(percent)} transition-all duration-700 ease-out rounded-full`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${isOver ? "text-rose-500" : isWarning ? "text-amber-500" : "text-foreground"}`}>
                    {percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditIdx(null); }} />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl animate-float-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">
                {editIdx !== null ? "Edit Anggaran" : "Tambah Anggaran"}
              </h3>
              <button onClick={() => { setShowForm(false); setEditIdx(null); }} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Kategori</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  disabled={editIdx !== null}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                >
                  {editIdx !== null ? (
                    <option value={formCategory}>{formCategory}</option>
                  ) : (
                    availableCategories.map(c => <option key={c} value={c}>{c}</option>)
                  )}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Batas Anggaran (Rp)</label>
                <input
                  type="number"
                  value={formLimit}
                  onChange={(e) => setFormLimit(e.target.value)}
                  placeholder="Contoh: 2000000"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowForm(false); setEditIdx(null); }}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveBudget}
                  disabled={!formCategory || !formLimit || parseFloat(formLimit) <= 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="size-4" />
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
