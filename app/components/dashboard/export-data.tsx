"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, X, Check, Loader2 } from "lucide-react";
import type { Transaction } from "@/lib/types";

interface ExportDataProps {
  transactions: Transaction[];
  onClose: () => void;
}

export function ExportData({ transactions, onClose }: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportedType, setExportedType] = useState<string | null>(null);

  // ─── CSV Export ─────────────────────────────────
  function exportCSV() {
    setIsExporting(true);
    try {
      const headers = ["Tanggal", "Judul", "Kategori", "Metode Pembayaran", "Tipe", "Jumlah"];
      const rows = transactions.map(tx => [
        tx.date,
        `"${tx.title.replace(/"/g, '""')}"`,
        tx.category,
        tx.payment_method,
        tx.type === "income" ? "Masuk" : "Keluar",
        tx.amount.toString(),
      ]);

      const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `finsight_transaksi_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setExportedType("CSV");
    } finally {
      setIsExporting(false);
    }
  }

  // ─── PDF Export (Print-Friendly) ────────────────
  function exportPDF() {
    setIsExporting(true);
    try {
      const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const rows = transactions.map(tx => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;">${tx.title}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${tx.category}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${tx.payment_method}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:${tx.type === "income" ? "#10b981" : "#ef4444"};font-weight:600;">
            ${tx.type === "income" ? "+" : "-"}Rp ${tx.amount.toLocaleString("id-ID")}
          </td>
        </tr>
      `).join("");

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>FinSight — Laporan Transaksi</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; color: #1a1a2e; padding: 40px; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #10b981; }
            .logo { font-size: 28px; font-weight: 800; color: #10b981; }
            .date { font-size: 13px; color: #6b7280; }
            .summary { display: flex; gap: 16px; margin-bottom: 32px; }
            .summary-card { flex: 1; padding: 16px 20px; border-radius: 12px; border: 1px solid #e5e7eb; }
            .summary-card h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 4px; }
            .summary-card p { font-size: 20px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; }
            th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 2px solid #e5e7eb; font-weight: 600; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">💸 FinSight</div>
            <div class="date">Laporan Transaksi — ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
          <div class="summary">
            <div class="summary-card">
              <h4>Total Transaksi</h4>
              <p>${transactions.length}</p>
            </div>
            <div class="summary-card">
              <h4>Total Pemasukan</h4>
              <p style="color:#10b981;">Rp ${income.toLocaleString("id-ID")}</p>
            </div>
            <div class="summary-card">
              <h4>Total Pengeluaran</h4>
              <p style="color:#ef4444;">Rp ${expense.toLocaleString("id-ID")}</p>
            </div>
            <div class="summary-card">
              <h4>Saldo</h4>
              <p style="color:${income - expense >= 0 ? '#10b981' : '#ef4444'};">Rp ${(income - expense).toLocaleString("id-ID")}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Transaksi</th>
                <th>Kategori</th>
                <th>Metode</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="footer">
            Dicetak dari FinSight — Personal Finance Analytics Dashboard • ${new Date().toLocaleDateString("id-ID")}
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `);
      printWindow.document.close();
      setExportedType("PDF");
    } finally {
      setIsExporting(false);
    }
  }

  const exportOptions = [
    {
      id: "csv",
      label: "Export CSV",
      description: "File spreadsheet yang bisa dibuka di Excel, Google Sheets",
      icon: FileSpreadsheet,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      action: exportCSV,
    },
    {
      id: "pdf",
      label: "Export PDF",
      description: "Laporan cetak dengan format profesional",
      icon: FileText,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      action: exportPDF,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-float-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Download className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Export Data</h2>
              <p className="text-xs text-muted-foreground">
                {transactions.length} transaksi siap diexport
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          {exportOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={opt.action}
                disabled={isExporting}
                className={`w-full flex items-center gap-4 rounded-xl border ${opt.border} ${opt.bg} p-4 text-left hover:scale-[1.01] transition-all disabled:opacity-50`}
              >
                <div className={`flex size-11 items-center justify-center rounded-xl bg-background/80 ${opt.color}`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
                <Download className="size-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Success Message */}
        {exportedType && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
            <Check className="size-4 text-emerald-500" />
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              {exportedType} berhasil diexport!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
