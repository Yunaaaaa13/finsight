"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { parseCSV } from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

interface CSVUploadProps {
  onImport: (data: Omit<Transaction, "id" | "created_at">[]) => void;
  onClose: () => void;
}

export function CSVUpload({ onImport, onClose }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Omit<Transaction, "id" | "created_at">[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (selectedFile: File) => {
    setError(null);

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Hanya file CSV yang didukung");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setIsLoading(true);
    setFile(selectedFile);

    try {
      const text = await selectedFile.text();
      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        setError("Tidak ada data valid yang ditemukan dalam file CSV");
        setFile(null);
        setIsLoading(false);
        return;
      }

      setPreview(parsed);
    } catch {
      setError("Gagal membaca file CSV");
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  }

  function handleImport() {
    if (preview.length > 0) {
      onImport(preview);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-float-in max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Upload CSV</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Import transaksi dari file CSV bank atau e-wallet
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Drop zone */}
        {!file && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div className={`flex size-14 items-center justify-center rounded-xl mb-4 transition-colors ${
              isDragging ? "bg-primary/15 text-primary" : "bg-muted/60 text-muted-foreground"
            }`}>
              <Upload className="size-7" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {isDragging ? "Lepas file di sini..." : "Drag & drop file CSV"}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              atau klik untuk pilih file • Maks 5MB
            </p>
            <p className="mt-3 text-[0.65rem] text-muted-foreground/60">
              Format: BCA, Mandiri, GoPay, OVO, Dana, atau CSV standar
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 mt-4">
            <AlertCircle className="size-4 text-rose-500 shrink-0" />
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-8">
            <Loader2 className="size-5 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Membaca file...</p>
          </div>
        )}

        {/* Preview */}
        {file && preview.length > 0 && !isLoading && (
          <div className="mt-4 space-y-4">
            {/* File info */}
            <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 p-3">
              <FileText className="size-5 text-emerald-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {preview.length} transaksi ditemukan
                </p>
              </div>
              <button
                onClick={() => { setFile(null); setPreview([]); }}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Preview table */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Judul</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Jumlah</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Tipe</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {preview.slice(0, 5).map((tx, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2 text-foreground font-medium truncate max-w-[150px]">{tx.title}</td>
                        <td className="px-3 py-2 text-foreground tabular-nums">
                          Rp {tx.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[0.6rem] font-semibold ${
                            tx.type === "income"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          }`}>
                            {tx.type === "income" ? "Masuk" : "Keluar"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.length > 5 && (
                <div className="px-3 py-2 text-center text-[0.65rem] text-muted-foreground bg-muted/30 border-t border-border">
                  ...dan {preview.length - 5} transaksi lainnya
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleImport}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
              >
                <Check className="size-4" />
                Import {preview.length} Transaksi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
