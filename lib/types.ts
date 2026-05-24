export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  amount: number; // Tetap dipertahankan untuk kompatibilitas sementara, namun nanti merujuk ke amount_base
  amount_original?: number;
  original_currency?: string;
  exchange_rate?: number;
  amount_base?: number;
  type: TransactionType;
  category: string;
  date: string; // ISO datetime string (YYYY-MM-DDTHH:mm)
  payment_method: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  preferred_currency: string;
  updated_at?: string;
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
