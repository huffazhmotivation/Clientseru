# Kuota Desain

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

## Akun designer (admin)

- **Akun designer pertama** dibuat lewat seed (env `ADMIN_EMAIL` / `ADMIN_PASSWORD`, lihat `prisma/seed.ts`).
- **Menambah akun designer baru** (tanpa menjalankan ulang data contoh), pakai script:

  ```bash
  npm run create-admin -- "Nama Designer" designer@studio.com passwordRahasia
  ```

  Kalau email sudah terdaftar sebagai designer, nama & password-nya akan di-update. Kalau email
  sudah dipakai akun CLIENT, script akan menolak (harus pakai email lain).
- Setelah login, designer bisa ganti password sendiri di halaman **Pengaturan** (tidak perlu lagi
  edit `.env` / re-seed).

## Akun client & ganti password

- Akun client dibuat oleh designer lewat menu **Clients** — designer menentukan password awal saat
  itu juga (ditampilkan sekali untuk dikirim ke client).
- Setelah login pertama, **client bisa ganti password sendiri** di halaman **Pengaturan** pada portal-nya
  (`/portal/settings`), dengan memasukkan password lama + password baru.
- Sengaja **tidak ada** fitur bagi designer untuk melihat atau mereset password client yang sudah
  diganti — begitu client mengganti passwordnya sendiri, hanya client itu yang tahu passwordnya.
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
  set "designerId" = (select id from "User" where role = 'ADMIN' order by "createdAt" asc limit 1)
  where "designerId" is null;

  update "Package"
  set "designerId" = (select id from "User" where role = 'ADMIN' order by "createdAt" asc limit 1)
  where "designerId" is null;
  ```
  (Kalau kolomnya belum ada di database, tambahkan dulu manual sebagai nullable, jalankan SQL di atas, baru `db push` lagi supaya jadi NOT NULL. Kabari saya kalau butuh dibantu persis sesuai isi database kamu.)

## Deploy

Aplikasi ini menyimpan file di folder `public/uploads` dan database di file SQLite, jadi jalankan di server
yang punya penyimpanan tetap (VPS, Docker dengan volume). Jalankan `npm run build` lalu `npm start`.
