import { Activity, ShieldAlert, ShieldCheck, Shield, AlertTriangle } from "lucide-react";
import type { Transaction } from "@/lib/types";

export function computeFinancialHealth(txs: Transaction[]) {
  const now = new Date();
  const thisMonth = txs.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const income = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  
  if (income === 0 && expense === 0) return { score: 0, status: "Belum Ada Data", color: "text-muted-foreground", bg: "bg-muted", icon: Activity };
  if (income === 0 && expense > 0) return { score: 0, status: "Risky", color: "text-rose-500", bg: "bg-rose-500/10", icon: ShieldAlert };

  let score = 50; // Base score

  // 1. Savings Ratio
  const balance = income - expense;
  const savingsRatio = balance / income;
  if (savingsRatio >= 0.2) score += 30; // Sangat baik
  else if (savingsRatio >= 0.1) score += 15; // Cukup baik
  else if (savingsRatio < 0) score -= 20; // Defisit

  // 2. Impulsive Spending ("Hiburan", "Belanja", "Lainnya")
  const impulsiveCat = ["Hiburan", "Belanja", "Lainnya"];
  const impulsiveExpense = thisMonth.filter(t => impulsiveCat.includes(t.category)).reduce((s, t) => s + t.amount, 0);
  const impulsiveRatio = impulsiveExpense / income;
  if (impulsiveRatio <= 0.1) score += 10;
  else if (impulsiveRatio > 0.3) score -= 15; // Terlalu boros

  // 3. Debt/Tagihan ("Tagihan")
  const debtExpense = thisMonth.filter(t => t.category === "Tagihan").reduce((s, t) => s + t.amount, 0);
  const debtRatio = debtExpense / income;
  if (debtRatio <= 0.3) score += 10;
  else if (debtRatio > 0.5) score -= 15; // Hutang/Tagihan terlalu besar

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status = "Risky";
  let color = "text-rose-500";
  let bg = "bg-rose-500/10";
  let Icon = ShieldAlert;

  if (score >= 90) {
    status = "Excellent"; color = "text-emerald-500"; bg = "bg-emerald-500/10"; Icon = ShieldCheck;
  } else if (score >= 75) {
    status = "Good"; color = "text-sky-500"; bg = "bg-sky-500/10"; Icon = Shield;
  } else if (score >= 50) {
    status = "Warning"; color = "text-amber-500"; bg = "bg-amber-500/10"; Icon = AlertTriangle;
  }

  return { score, status, color, bg, icon: Icon };
}

interface FinancialHealthProps {
  transactions: Transaction[];
}

export function FinancialHealthCard({ transactions }: FinancialHealthProps) {
  const health = computeFinancialHealth(transactions);
  const Icon = health.icon;

  return (
    <div className={`rounded-2xl border border-border bg-card p-6 flex items-center justify-between shadow-sm card-glow`}>
      <div className="flex items-center gap-4">
        <div className={`flex size-14 items-center justify-center rounded-2xl ${health.bg}`}>
          <Icon className={`size-7 ${health.color}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Financial Health Score</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">{health.score}</h3>
            <span className="text-sm font-medium text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${health.bg} ${health.color}`}>
          <div className={`size-1.5 rounded-full ${health.color.replace('text-', 'bg-')}`} />
          {health.status}
        </div>
        <p className="mt-2 text-xs text-muted-foreground max-w-[150px] leading-relaxed hidden sm:block">
          Berdasarkan rasio tabungan, utang, dan kestabilan arus kas bulan ini.
        </p>
      </div>
    </div>
  );
}
