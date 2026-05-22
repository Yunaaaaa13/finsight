export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO date string (YYYY-MM-DD)
  payment_method: string;
  created_at?: string;
}

export const CATEGORIES = [
  "Makanan & Minuman",
  "Transportasi",
  "Tagihan",
  "Hiburan",
  "Kesehatan",
  "Belanja",
  "Pendidikan",
  "Investasi",
  "Gaji",
  "Freelance",
  "Bisnis",
  "Hadiah",
  "Lainnya",
] as const;

export const PAYMENT_METHODS = [
  "Cash",
  "M-Banking",
  "Kartu Debit/Kredit",
  "E-Wallet",
  "Lainnya",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
