# Kuota Desain

Aplikasi internal untuk mencatat kuota desain per client, request desain, dan riwayat pemakaian.
Next.js (App Router) + TypeScript + Tailwind + Prisma + SQLite.

## Menjalankan

```bash
npm install
cp .env.example .env        # isi AUTH_SECRET dengan string acak
npm run setup               # buat database + data contoh
npm run dev                 # http://localhost:3000
```

Akun contoh setelah seed:

| Peran    | Email               | Password    |
| -------- | ------------------- | ----------- |
| Designer | designer@studio.com | designer123 |
| Client   | abc@client.com      | client123   |
| Client   | xyz@client.com      | client123   |

Ganti password admin dengan menjalankan seed memakai variabel lingkungan:

```bash
ADMIN_EMAIL=saya@studio.com ADMIN_PASSWORD=rahasia npm run db:seed
```

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

## Deploy

Aplikasi ini menyimpan file di folder `public/uploads` dan database di file SQLite, jadi jalankan di server
yang punya penyimpanan tetap (VPS, Docker dengan volume). Jalankan `npm run build` lalu `npm start`.
