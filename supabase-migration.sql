-- ================================================
-- Finsight: Tabel Transaksi
-- Jalankan SQL ini di Supabase SQL Editor:
-- https://supabase.com/dashboard → Project → SQL Editor
-- ================================================

-- 1. Buat tabel transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL DEFAULT 'Lainnya',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL DEFAULT 'Cash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index untuk query performa
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 4. Policy: allow all operations for anonymous users (development)
--    ⚠️ Untuk production, ganti dengan policy berbasis auth.uid()
CREATE POLICY "Allow all for anon" ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. (Opsional) Data contoh untuk testing
INSERT INTO transactions (title, amount, type, category, date, payment_method) VALUES
  ('Gaji Bulanan', 15000000, 'income', 'Gaji', '2026-05-01', 'Transfer Bank'),
  ('Freelance Project', 5000000, 'income', 'Freelance', '2026-05-05', 'Transfer Bank'),
  ('Makan Siang', 45000, 'expense', 'Makanan & Minuman', '2026-05-10', 'GoPay'),
  ('Bensin Motor', 80000, 'expense', 'Transportasi', '2026-05-11', 'Cash'),
  ('Listrik & Air', 450000, 'expense', 'Tagihan', '2026-05-15', 'Transfer Bank'),
  ('Netflix', 186000, 'expense', 'Hiburan', '2026-05-15', 'Kartu Kredit'),
  ('Konsultasi Dokter', 250000, 'expense', 'Kesehatan', '2026-05-18', 'Dana'),
  ('Grab ke Kantor', 35000, 'expense', 'Transportasi', '2026-05-19', 'OVO'),
  ('Coffee Shop', 55000, 'expense', 'Makanan & Minuman', '2026-05-20', 'ShopeePay'),
  ('Bonus Project', 3000000, 'income', 'Bisnis', '2026-05-21', 'Transfer Bank');
