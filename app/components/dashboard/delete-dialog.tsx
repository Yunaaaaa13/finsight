"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import type { Transaction } from "@/lib/types";

interface DeleteDialogProps {
  transaction: Transaction;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteDialog({ transaction, onConfirm, onClose }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl animate-float-in">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-rose-500/10">
            <AlertTriangle className="size-6 text-rose-500" />
          </div>
        </div>

        <h3 className="text-center text-lg font-bold text-foreground">Hapus Transaksi?</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Transaksi berikut akan dihapus permanen:
        </p>

        {/* Transaction detail */}
        <div className="mt-4 rounded-xl bg-muted/40 p-3 space-y-1">
          <p className="text-sm font-semibold text-foreground">{transaction.title}</p>
          <p className="text-xs text-muted-foreground">
            Rp {transaction.amount.toLocaleString("id-ID")} •{" "}
            {new Date(transaction.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500/15 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-all"
          >
            <Trash2 className="size-4" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
