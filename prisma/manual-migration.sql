-- ClientSeru: migrasi role ADMIN -> DESIGNER + tabel undangan client
-- AMAN dijalankan di database yang sudah ada isinya. TIDAK menghapus/reset data apapun.
--
-- Jalankan file ini SEBELUM `npx prisma db push`, supaya perubahan enum
-- dilakukan lewat RENAME (data existing otomatis ikut berubah nilainya),
-- bukan lewat drop+recreate enum yang bisa ditolak Prisma karena "data loss".
--
-- Cara menjalankan (pilih salah satu):
--   1) npx prisma db execute --file prisma/manual-migration.sql --schema prisma/schema.prisma
--   2) atau tempel isi file ini ke SQL editor Supabase / psql yang terhubung ke DATABASE_URL kamu
--
-- Urutan:
--   1. Rename value enum Role: 'ADMIN' -> 'DESIGNER' (baris User yang sebelumnya role=ADMIN
--      otomatis menjadi role=DESIGNER, TANPA perlu UPDATE manual, tanpa downtime/reset).
--   2. (Opsional, hanya guard) memastikan tidak ada sisa constraint yang mereferensikan nama lama.

BEGIN;

ALTER TYPE "Role" RENAME VALUE 'ADMIN' TO 'DESIGNER';

COMMIT;

-- Setelah ini, jalankan:
--   npx prisma db push
-- untuk membuat tabel baru (ClientInvitation) dan index-nya. Ini murni ADDITIVE
-- (tabel baru + kolom baru yang nullable/ada default), jadi aman tanpa --accept-data-loss
-- dan TANPA --force-reset.
