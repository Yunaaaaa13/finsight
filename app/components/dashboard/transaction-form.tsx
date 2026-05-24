"use client";

import { useState } from "react";
import { X, Plus, Save, Loader2, Globe } from "lucide-react";
import type { Transaction, TransactionType } from "@/lib/types";
import { CATEGORIES, PAYMENT_METHODS } from "@/lib/types";

const CURRENCIES = ["IDR", "USD", "EUR", "SGD", "JPY", "MYR", "AUD", "GBP"];

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSave: (data: Omit<Transaction, "id" | "created_at">) => void;
  onClose: () => void;
}

export function TransactionForm({ transaction, onSave, onClose }: TransactionFormProps) {
  const isEditing = !!transaction;

  const [title, setTitle] = useState(transaction?.title ?? "");
  const [amount, setAmount] = useState(transaction?.amount?.toString() ?? "");
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const [category, setCategory] = useState(transaction?.category ?? CATEGORIES[0]);
  const [date, setDate] = useState(() => {
    if (transaction?.date) {
      return transaction.date.includes("T") 
        ? transaction.date.slice(0, 16) 
        : `${transaction.date}T12:00`;
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [paymentMethod, setPaymentMethod] = useState(transaction?.payment_method ?? PAYMENT_METHODS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Multi-Currency & Format States
  const [currency, setCurrency] = useState("IDR");
  const [isConverting, setIsConverting] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(() => {
    if (!transaction?.amount) return "";
    return new Intl.NumberFormat('en-US').format(transaction.amount);
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Remove characters that aren't digits or dots
    const cleanVal = val.replace(/,/g, "").replace(/[^0-9.]/g, "");
    
    if (cleanVal === "") {
      setDisplayAmount("");
      return;
    }
    
    // Prevent multiple dots
    const dotCount = (cleanVal.match(/\./g) || []).length;
    if (dotCount > 1) return;

    const parts = cleanVal.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setDisplayAmount(parts.join("."));
  };

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Judul wajib diisi";
    
    const numericAmount = parseFloat(displayAmount.replace(/,/g, ""));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = "Jumlah harus valid dan lebih dari 0";
    }
    
    if (!date) newErrors.date = "Tanggal wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    
    const numericAmount = parseFloat(displayAmount.replace(/,/g, ""));
    
    setIsConverting(true);
    try {
      let finalAmount = numericAmount;
      let finalTitle = title.trim();

      if (currency !== "IDR") {
        // Fetch exchange rate
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
        const data = await res.json();
        const rate = data.rates["IDR"];
        
        if (rate) {
          finalAmount = Math.round(numericAmount * rate);
          finalTitle = `[${currency} ${displayAmount}] ${finalTitle}`;
        } else {
          throw new Error("Gagal mengambil kurs mata uang");
        }
      }

      onSave({
        title: finalTitle,
        amount: finalAmount,
        type,
        category,
        date,
        payment_method: paymentMethod,
      });
    } catch (err) {
      setErrors({ ...errors, amount: "Gagal mengambil kurs dari server. Pastikan koneksi internet Anda aktif." });
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-float-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isEditing ? "Edit Transaksi" : "Tambah Transaksi"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {isEditing ? "Perbarui detail transaksi" : "Masukkan detail transaksi baru"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2 p-1 rounded-xl bg-muted/50">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                type === "expense"
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                type === "income"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pemasukan
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Makan siang, Gaji bulanan"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
          </div>

          {/* Currency & Amount */}
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                <Globe className="size-3" /> Mata Uang
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer text-center"
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Jumlah</label>
              <input
                type="text"
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="1,000.00"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
          {errors.amount && <p className="mt-1 text-xs text-rose-500">{errors.amount}</p>}
          {currency !== "IDR" && !errors.amount && displayAmount && (
            <p className="mt-1 text-[10px] text-amber-600 flex items-center gap-1">
              *Akan dikonversi otomatis ke IDR saat disimpan
            </p>
          )}

          {/* Category & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Metode Bayar</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Tanggal & Jam</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isConverting}
              className="flex-1 rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isConverting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
            >
              {isConverting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Mengonversi...
                </>
              ) : (
                <>
                  {isEditing ? <Save className="size-4" /> : <Plus className="size-4" />}
                  {isEditing ? "Simpan" : "Tambah"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
