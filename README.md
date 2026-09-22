# ClientSeru

Aplikasi internal untuk mencatat kuota desain per client, request desain, dan riwayat pemakaian.
Next.js (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL (mis. database Supabase).

Login/password dibuat **sendiri** oleh aplikasi ini (tabel `User`, hash bcrypt, cookie sesi) — bukan
memakai fitur Supabase Auth. Kalau database di-host di Supabase, Supabase di sini hanya berperan
sebagai penyedia PostgreSQL (isi `DATABASE_URL` / `DIRECT_URL` dari project Supabase kamu).

## Menjalankan

```bash
npm install
cp .env.example .env        # isi DATABASE_URL, DIRECT_URL, dan AUTH_SECRET (string acak)
npm run setup               # migrasi database + data contoh
npm run dev                 # http://localhost:3000
```

Akun contoh setelah seed:

| Peran    | Email               | Password    |
| -------- | ------------------- | ----------- |
| Designer | designer@studio.com | designer123 |
| Client   | abc@client.com      | client123   |
| Client   | xyz@client.com      | client123   |

## Role

Hanya ada 2 role (enum `Role` di `prisma/schema.prisma`):

- **DESIGNER** — bisa daftar sendiri, mengelola client/project/kuota lewat dashboard designer (`/dashboard`, dst).
- **CLIENT** — tidak punya register publik; akun dibuat lewat undangan designer, login di halaman login existing, masuk ke dashboard client (`/portal`).

## Akun designer

- **Designer bisa daftar sendiri** di halaman `/register` (nama, email, password). Setelah daftar, langsung login dan diarahkan ke `/dashboard`.
- **Akun designer pertama/awal (opsional)** juga bisa dibuat lewat seed (env `ADMIN_EMAIL` / `ADMIN_PASSWORD` — nama env sengaja dipertahankan untuk kompatibilitas, isinya tetap akun role `DESIGNER`, lihat `prisma/seed.ts`).
- **Menambah akun designer lewat CLI** (tanpa lewat form, mis. dari server), pakai script:

  ```bash
  npm run create-admin -- "Nama Designer" designer@studio.com passwordRahasia
  ```

  Kalau email sudah terdaftar sebagai designer, nama & password-nya akan di-update. Kalau email
  sudah dipakai akun CLIENT, script akan menolak (harus pakai email lain).
- Setelah login, designer bisa ganti password sendiri di halaman **Pengaturan** (tidak perlu lagi
  edit `.env` / re-seed).

## Akun client — alur undangan (invitation)

Client **tidak punya register publik**. Alurnya:

1. Designer buka menu **Clients → Tambah Client**, isi nama PIC + email (+ data lain seperti biasa: perusahaan, paket, kuota). **Tidak ada input password di sini.**
2. Sistem membuat baris `Client` (data bisnis, langsung dipakai untuk kuota/paket) sekaligus 1 baris `ClientInvitation` dengan token unik, dan menampilkan link `/invite/[token]` yang bisa disalin designer untuk dikirim ke client.
3. Client membuka link tersebut → melihat ringkasan undangan (nama perusahaan, nama designer pengundang) → membuat password sendiri.
4. Setelah submit, akun `User` (role `CLIENT`, `clientId` = client tsb) baru dibuat, token ditandai terpakai (`usedAt`, sekali pakai — tidak bisa dipakai ulang), dan client otomatis login lalu diarahkan ke `/portal`.
5. Kalau link hilang/kadaluarsa secara praktis dan client belum aktivasi, designer bisa klik **"Buat ulang link"** di halaman detail client (hanya bisa selama client belum aktivasi; ditolak kalau sudah ada akun aktif).
6. Setelah login pertama, **client bisa ganti password sendiri** di halaman **Pengaturan** pada portal-nya
   (`/portal/settings`), dengan memasukkan password lama + password baru.
- Sengaja **tidak ada** fitur bagi designer untuk melihat atau mereset password client yang sudah
  diganti — begitu client mengaktivasi/mengganti passwordnya sendiri, hanya client itu yang tahu passwordnya.
  Kalau client lupa password, satu-satunya jalan adalah lewat akses database langsung (mis.
  `npm run db:studio`) untuk membuat ulang password sementara.

Perintah lain: `npm run typecheck`, `npm run db:studio`, `npm run build`.

## Struktur

```
prisma/schema.prisma      skema database
prisma/seed.ts            data awal
src/app/login             halaman login
src/app/(app)             area designer: dashboard, clients, requests, riwayat, pengaturan
src/app/(portal)/portal   area client: ringkasan kuota, request desain
src/app/api               route handler (auth, clients, packages, requests, upload)
src/components            komponen UI dan form
src/lib                   prisma, auth, validasi, aturan kuota, helper
public/uploads            file brief dan referensi
```

## Aturan kuota

- Kuota dipotong satu kali saat request berubah menjadi **Selesai**.
- Mengembalikan status dari Selesai ke status lain akan mengembalikan kuota dan mencatatnya sebagai koreksi.
- Request baru ditolak bila sisa kuota dikurangi request yang masih berjalan tidak mencukupi.
- Penambahan atau koreksi kuota manual selalu tercatat di riwayat beserta alasannya.
- **Kuota per-request bisa pecahan.** Dari dialog detail request, designer bisa mengisi manual
  berapa slot yang dipakai request tertentu — tidak harus 1, bisa 1.5, 2, 2.5, dst. Nilainya harus
  kelipatan 0.5 (divalidasi di server) supaya total & sisa kuota client tetap presisi. Setelah
  request berstatus **Selesai** (kuotanya sudah terpotong), jumlah kuotanya terkunci dan tidak bisa
  diubah lagi — kalau perlu koreksi, kembalikan dulu statusnya dari Selesai, baru ubah jumlah
  kuotanya, atau pakai menu "Tambah kuota" di halaman client untuk koreksi manual.
  > Migrasi skema: kolom `totalQuota`/`usedQuota` (ClientQuota), `quotaCost` (DesignRequest), dan
  > `amount` (QuotaHistory) berubah dari `Int` ke `Float`. Cukup jalankan `npx prisma db push`
  > seperti biasa — Postgres bisa meng-cast `integer` ke `double precision` secara otomatis, jadi
  > aman tanpa `--accept-data-loss` dan data lama tidak berubah nilainya.

## Multi-designer

Sekarang aplikasi ini mendukung **banyak akun designer sekaligus, masing-masing dengan client sendiri**:

- Setiap client (tabel `Client`) dimiliki oleh satu designer (`Client.designerId`). Designer A **tidak bisa** melihat, mengedit, atau melihat request/riwayat kuota milik client-nya designer B — baik dari dashboard, daftar client, kanban request, riwayat kuota, maupun lewat API (dicoba akses langsung pakai ID pun akan dapat 404).
- **Paket kuota** (mis. "Monthly Design 30") sekarang **juga per-designer** — tiap designer punya katalog paketnya sendiri (dikelola di halaman **Pengaturan**), tidak kelihatan atau bisa dipakai oleh designer lain. Nama paket boleh sama antar designer (unik-nya per designer, bukan global).
- Menambah akun designer baru tetap lewat `npm run create-admin -- "Nama" email password` (lihat bagian "Akun designer (admin)" di atas). Setiap akun designer baru mulai dengan 0 client — mereka bikin client sendiri lewat menu **Clients** setelah login.

### Migrasi database yang sudah punya data

Karena `Client` dan `Package` sekarang **wajib** punya `designerId`, kalau database kamu sudah terisi data sebelum update ini:

- **Kalau cuma data contoh/dev** (belum ada client/paket asli): reset saja lalu seed ulang —
  ```bash
  npx prisma db push --force-reset
  npm run db:seed
  ```
- **Kalau sudah ada data asli yang mau dipertahankan**: backfill dulu manual sebelum `db push`, misal lewat `psql`/Supabase SQL editor:
  ```sql
  -- pastikan minimal ada 1 admin, lalu assign semua client & paket tanpa designerId ke admin pertama:
  update "Client"
  set "designerId" = (select id from "User" where role = 'DESIGNER' order by "createdAt" asc limit 1)
  where "designerId" is null;

  update "Package"
  set "designerId" = (select id from "User" where role = 'DESIGNER' order by "createdAt" asc limit 1)
  where "designerId" is null;
  ```
  (Kalau kolomnya belum ada di database, tambahkan dulu manual sebagai nullable, jalankan SQL di atas, baru `db push` lagi supaya jadi NOT NULL. Kabari saya kalau butuh dibantu persis sesuai isi database kamu.)

## Penyimpanan file (upload)

Vercel (dan platform serverless lain) punya filesystem **read-only & sementara** — menulis ke
folder `public/uploads` seperti versi awal aplikasi ini **selalu gagal (500)** di sana, walau
jalan normal kalau dites di komputer sendiri (`npm run dev`). Karena itu upload sekarang:

- Disimpan sebagai base64 di tabel `UploadedFile` (Postgres yang sudah kamu pakai, tidak perlu
  layanan tambahan).
- Disajikan lewat `GET /api/files/[id]` (bukan link file statis), supaya tetap bisa dibuka di tab
  baru / didownload seperti biasa.
- Cukup jalankan `npx prisma db push` seperti biasa (tabel baru ini murni additive) — tidak ada
  langkah tambahan lain.

Catatan: pendekatan ini cocok untuk skala kecil-menengah (maks. 5 MB per file). Kalau volume upload
sudah besar, pertimbangkan pindah ke object storage seperti Vercel Blob / Supabase Storage.

## Deploy

Untuk Postgres (Supabase, Neon, dll), set `DATABASE_URL` (dan `DIRECT_URL` kalau pakai koneksi
pooled) di environment variables, lalu jalankan `npx prisma db push` sebelum/pertama kali deploy.
Untuk Vercel: `npm run build` jalan otomatis lewat auto-deploy; tidak perlu volume/disk permanen
lagi karena upload sekarang disimpan di database (lihat bagian "Penyimpanan file" di atas).
