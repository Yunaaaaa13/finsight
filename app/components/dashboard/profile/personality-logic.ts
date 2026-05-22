import { Crown, Zap, Shield, TrendingUp, Compass, LucideIcon } from "lucide-react";
import type { Transaction } from "@/lib/types";

export interface PersonalityResult {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  traits: string[];
}

export function computePersonality(txs: Transaction[]): PersonalityResult {
  if (txs.length === 0) {
    return {
      id: "explorer",
      title: "Financial Explorer",
      description: "Anda baru saja memulai perjalanan. Terus catat transaksi Anda untuk menemukan identitas finansial Anda.",
      icon: Compass,
      color: "text-slate-500",
      bg: "bg-slate-500/10",
      traits: ["Penuh Rasa Ingin Tahu", "Langkah Pertama"],
    };
  }

  const income = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  
  // Categorical spending
  const byCat: Record<string, number> = {};
  txs.filter(t => t.type === "expense").forEach((t) => {
    byCat[t.category] = (byCat[t.category] || 0) + t.amount;
  });

  const getCatAmount = (catNames: string[]) => catNames.reduce((s, cat) => s + (byCat[cat] || 0), 0);

  const investmentAmount = getCatAmount(["Investasi", "Bisnis"]);
  const impulsiveAmount = getCatAmount(["Hiburan", "Belanja", "Lainnya"]);
  const fixedAmount = getCatAmount(["Tagihan", "Pendidikan", "Kesehatan"]);

  const savingsRatio = income > 0 ? (income - expense) / income : 0;
  const investmentRatio = expense > 0 ? investmentAmount / expense : 0;
  const impulsiveRatio = expense > 0 ? impulsiveAmount / expense : 0;
  const fixedRatio = expense > 0 ? fixedAmount / expense : 0;

  // 1. Investor
  if (investmentRatio >= 0.25) {
    return {
      id: "investor",
      title: "The Visionary Investor",
      description: "Masa depan adalah milik Anda. Anda secara konsisten menyisihkan sebagian besar pengeluaran untuk investasi dan aset jangka panjang.",
      icon: TrendingUp,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      traits: ["Berpikir Jangka Panjang", "Risk Taker Terukur", "Fokus Pertumbuhan"],
    };
  }

  // 2. Strategic Saver
  if (savingsRatio >= 0.3) {
    return {
      id: "saver",
      title: "Strategic Saver",
      description: "Keamanan finansial adalah nama tengah Anda. Sebagian besar pemasukan Anda berhasil diselamatkan dari gaya hidup konsumtif.",
      icon: Shield,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      traits: ["Sangat Disiplin", "Pengendalian Diri Kuat", "Persiapan Dana Darurat"],
    };
  }

  // 3. Impulsive Buyer
  if (impulsiveRatio >= 0.35) {
    return {
      id: "impulsive",
      title: "Spontaneous Buyer",
      description: "Anda sangat menikmati momen saat ini. Sebagian besar pengeluaran Anda bersifat hiburan dan kesenangan impulsif.",
      icon: Zap,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      traits: ["FOMO (Fear Of Missing Out)", "Mementingkan Gaya Hidup", "Royal"],
    };
  }

  // 4. Budget Master
  if (fixedRatio >= 0.4 && savingsRatio > 0) {
    return {
      id: "budget_master",
      title: "Budget Master",
      description: "Penguasa anggaran yang handal. Pengeluaran wajib Anda terkelola dengan sangat baik tanpa mengorbankan stabilitas kas.",
      icon: Crown,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      traits: ["Sangat Terencana", "Patuh Aturan (50/30/20)", "Cermat"],
    };
  }

  // Default Fallback
  return {
    id: "balanced",
    title: "The Balanced Explorer",
    description: "Gaya keuangan Anda sedang beradaptasi. Anda berada di tengah-tengah antara menikmati hidup dan mempersiapkan masa depan.",
    icon: Compass,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    traits: ["Adaptif", "Fleksibel", "Mencari Pola"],
  };
}
