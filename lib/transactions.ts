import { supabase } from "@/lib/supabase";
import type { Transaction, TransactionType } from "@/lib/types";

// ─── CRUD Operations ─────────────────────────────

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
  return data ?? [];
}

export async function addTransaction(
  tx: Omit<Transaction, "id" | "created_at">
): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from("transactions")
    .insert(tx)
    .select()
    .single();

  if (error) {
    console.error("Error adding transaction:", error);
    return null;
  }
  return data;
}

export async function updateTransaction(
  id: string,
  tx: Partial<Omit<Transaction, "id" | "created_at">>
): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from("transactions")
    .update(tx)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating transaction:", error);
    return null;
  }
  return data;
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting transaction:", error);
    return false;
  }
  return true;
}

// ─── CSV Parsing ──────────────────────────────────

export function parseCSV(csvText: string): Omit<Transaction, "id" | "created_at">[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));

  const results: Omit<Transaction, "id" | "created_at">[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
    });

    // Map columns flexibly
    const title =
      row["title"] || row["description"] || row["keterangan"] || row["nama"] || row["memo"] || `Transaksi ${i}`;

    const rawAmount =
      row["amount"] || row["jumlah"] || row["nominal"] || row["value"] || "0";
    const amount = Math.abs(parseFloat(rawAmount.replace(/[^0-9.-]/g, "")) || 0);

    const type: TransactionType =
      (row["type"] || row["tipe"] || row["jenis"] || "").toLowerCase() === "income" ||
      parseFloat(rawAmount.replace(/[^0-9.-]/g, "")) > 0
        ? "income"
        : "expense";

    const category = row["category"] || row["kategori"] || "Lainnya";
    const date = normalizeDate(row["date"] || row["tanggal"] || row["tgl"] || "");
    const payment_method =
      row["payment_method"] || row["metode"] || row["bank"] || row["source"] || "Lainnya";

    if (amount > 0) {
      results.push({ title, amount, type, category, date, payment_method });
    }
  }

  return results;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function normalizeDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];

  // Try ISO format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr.substring(0, 10);
  }

  // Try DD/MM/YYYY or DD-MM-YYYY
  const match = dateStr.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (match) {
    const [, d, m, y] = match;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // Fallback
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
}

export async function importTransactionsFromCSV(
  file: File
): Promise<{ imported: number; errors: number }> {
  const text = await file.text();
  const transactions = parseCSV(text);

  let imported = 0;
  let errors = 0;

  // Batch insert
  if (transactions.length > 0) {
    const { data, error } = await supabase
      .from("transactions")
      .insert(transactions)
      .select();

    if (error) {
      console.error("CSV import error:", error);
      errors = transactions.length;
    } else {
      imported = data?.length ?? 0;
      errors = transactions.length - imported;
    }
  }

  return { imported, errors };
}
