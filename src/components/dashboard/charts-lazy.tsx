"use client";

import dynamic from "next/dynamic";

/**
 * recharts adalah bagian JS terbesar di dashboard. Karena ResponsiveContainer tidak bisa
 * merender apa pun di server (lebar 0), grafik toh baru muncul setelah hydrate — jadi
 * library-nya dimuat terpisah supaya tidak menahan halaman jadi interaktif. Placeholder
 * setinggi grafik dipakai agar tidak ada layout shift.
 */
const placeholder = () => <div className="h-[220px]" aria-hidden />;

export const QuotaUsageBarChart = dynamic(
  () => import("./chart-card").then((m) => m.QuotaUsageBarChart),
  { ssr: false, loading: placeholder },
);
export const RequestsPerMonthChart = dynamic(
  () => import("./chart-card").then((m) => m.RequestsPerMonthChart),
  { ssr: false, loading: placeholder },
);
export const WorkloadBarChart = dynamic(
  () => import("./chart-card").then((m) => m.WorkloadBarChart),
  { ssr: false, loading: placeholder },
);
