import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // Only bundle the icons/chart pieces actually imported instead of the whole
  // library barrel file — cuts client JS size (and therefore parse/hydrate
  // time) meaningfully since lucide-react and recharts are used on nearly
  // every page.
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
    // Router cache. Secara default Next 15 TIDAK menyimpan halaman dinamis sama
    // sekali (dynamic: 0) — artinya setiap klik menu / tombol Back selalu menunggu
    // server + database lagi. Dengan ini halaman yang baru dikunjungi (atau sudah
    // di-prefetch penuh lewat <Link prefetch>) langsung tampil tanpa delay.
    // Setelah mutasi (ubah status, tambah kuota, dst) kode memanggil
    // router.refresh() yang otomatis mengosongkan cache ini, jadi data tidak basi.
    staleTimes: {
      dynamic: 30,
      static: 60,
    },
  },
};

export default nextConfig;
