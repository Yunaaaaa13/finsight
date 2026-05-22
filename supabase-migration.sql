-- ================================================
-- Finsight: Tabel Transaksi
-- Jalankan SQL ini di Supabase SQL Editor:
-- https://supabase.com/dashboard → Project → SQL Editor
-- ================================================

-- 1. Buat ulang tabel transactions (Hapus yang lama agar bersih)
DROP TABLE IF EXISTS transactions CASCADE;

CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL DEFAULT 'Lainnya',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL DEFAULT 'Cash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- (Opsional) Jika tabel sudah ada dan ingin menambahkan user_id tanpa drop:
-- ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
-- Anda mungkin harus menghapus data lama atau set user_id dummy terlebih dahulu agar NOT NULL tidak error.

-- 2. Index untuk query performa
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 4. Policy: allow all operations for authenticated users on THEIR OWN rows
DROP POLICY IF EXISTS "Allow all for anon" ON transactions;

CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- 5. (Opsional) Data contoh untuk testing
INSERT INTO transactions (title, amount, type, category, date, payment_method) VALUES
  ('Gaji Bulanan', 15000000, 'income', 'Gaji', '2026-05-01', 'M-Banking'),
  ('Freelance Project', 5000000, 'income', 'Freelance', '2026-05-05', 'M-Banking'),
  ('Makan Siang', 45000, 'expense', 'Makanan & Minuman', '2026-05-10', 'E-Wallet'),
  ('Bensin Motor', 80000, 'expense', 'Transportasi', '2026-05-11', 'Cash'),
  ('Listrik & Air', 450000, 'expense', 'Tagihan', '2026-05-15', 'M-Banking'),
  ('Netflix', 186000, 'expense', 'Hiburan', '2026-05-15', 'Kartu Debit/Kredit'),
  ('Konsultasi Dokter', 250000, 'expense', 'Kesehatan', '2026-05-18', 'E-Wallet'),
  ('Grab ke Kantor', 35000, 'expense', 'Transportasi', '2026-05-19', 'E-Wallet'),
  ('Coffee Shop', 55000, 'expense', 'Makanan & Minuman', '2026-05-20', 'E-Wallet'),
  ('Bonus Project', 3000000, 'income', 'Bisnis', '2026-05-21', 'Transfer Bank');

-- ================================================
-- 6. Setup Storage untuk Foto Profil (Avatars)
-- ================================================
-- Mengizinkan user mengupload foto profil ke storage.
-- Pastikan Anda juga telah mengaktifkan Storage di dashboard Supabase jika belum.

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy agar semua orang bisa melihat avatar (karena public)
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Policy agar user yang login bisa mengupload avatar
CREATE POLICY "Users can upload their own avatar." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Policy agar user bisa mengupdate avatar mereka
CREATE POLICY "Users can update their own avatar." ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
