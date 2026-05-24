-- ================================================
-- Finsight: Migrasi Database untuk Global Currency Switcher
-- Jalankan SQL ini di Supabase SQL Editor Anda
-- ================================================

-- 1. Buat Tabel Profiles untuk menyimpan preferensi pengguna (seperti preferred_currency)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_currency TEXT NOT NULL DEFAULT 'IDR',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS untuk Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);


-- 2. Tambah kolom baru ke tabel transactions
ALTER TABLE transactions 
  ADD COLUMN IF NOT EXISTS amount_original DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS original_currency TEXT,
  ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(15,6),
  ADD COLUMN IF NOT EXISTS amount_base DECIMAL(15,2);

-- 3. Migrasi data lama (Backward Compatibility)
-- Kita asumsikan data lama yang sudah ada di database adalah IDR.
UPDATE transactions
SET 
  amount_original = amount,
  original_currency = 'IDR',
  exchange_rate = 1.000000,
  amount_base = amount
WHERE amount_base IS NULL;

-- 4. Ubah konstrain pada kolom baru agar NOT NULL setelah diisi data migrasi
ALTER TABLE transactions ALTER COLUMN amount_original SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN original_currency SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN exchange_rate SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN amount_base SET NOT NULL;

-- Catatan:
-- Saat kita melakukan fetch dari codebase Next.js, kolom `amount` lama
-- bisa tetap ada untuk kompatibilitas jika masih dipakai, 
-- namun ke depannya kita akan memakai `amount_base` dan `amount_original`.
