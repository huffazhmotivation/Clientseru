import { Users, ListChecks, CheckCircle2, Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { listClientsWithQuota } from "@/lib/quota";
import { EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { StatCard } from "@/components/dashboard/stat-card";
import { ClientCard } from "@/components/dashboard/client-card";
import { ChartCard, QuotaUsageBarChart, RequestsPerMonthChart, WorkloadBarChart } from "@/components/dashboard/chart-card";

export const dynamic = "force-dynamic";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const MONTH_LABEL = new Intl.DateTimeFormat("id-ID", { month: "short" });

export default async function DashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [clients, openRequests, doneThisMonth, recentRequests] = await Promise.all([
    listClientsWithQuota(),
    prisma.designRequest.findMany({
      where: { status: { in: ["PENDING", "WORKING", "REVISION"] } },
      include: { client: { select: { id: true, company: true } } },
    }),
    prisma.designRequest.count({ where: { status: "DONE", doneAt: { gte: startOfMonth } } }),
    prisma.designRequest.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
  ]);

  const active = clients.filter((c) => c.active);
  const estimatedRevenue = active.reduce((sum, c) => sum + (c.package?.price ?? 0), 0);

  // Requests per month (last 6 months)
  const monthBuckets: { month: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthBuckets.push({ month: MONTH_LABEL.format(d), total: 0 });
  }
  for (const r of recentRequests) {
    const d = new Date(r.createdAt);
    const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    const bucket = diff >= 0 && diff <= 5 ? monthBuckets[5 - diff] : undefined;
    if (bucket) bucket.total += 1;
  }

  // Workload: active requests per client (top 6)
  const workloadMap = new Map<string, { name: string; active: number }>();
  for (const r of openRequests) {
    const key = r.client.company;
    workloadMap.set(key, { name: key, active: (workloadMap.get(key)?.active ?? 0) + 1 });
  }
  const workload = Array.from(workloadMap.values())
    .sort((a, b) => b.active - a.active)
    .slice(0, 6);

  const quotaUsageData = clients.slice(0, 8).map((c) => ({ name: c.company, used: c.used, total: c.total }));

  return (
    <>
      <PageHeader
        eyebrow="Command Center"
        title="Dashboard"
        description="Ringkasan kuota seluruh client, beban kerja, dan pekerjaan yang sedang berjalan."
        action={<LinkButton href="/clients" variant="primary">+ Tambah Client</LinkButton>}
      />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Client" value={clients.length} hint={`${active.length} aktif`} icon={Users} tone="brand" />
        <StatCard label="Request Aktif" value={openRequests.length} icon={ListChecks} tone="blue" />
        <StatCard label="Selesai Bulan Ini" value={doneThisMonth} icon={CheckCircle2} tone="emerald" />
        <StatCard
          label="Estimasi Revenue"
          value={rupiah.format(estimatedRevenue)}
          hint="dari paket client aktif"
          icon={Wallet}
          tone="amber"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Request per bulan" description="Tren jumlah request masuk, 6 bulan terakhir.">
          <RequestsPerMonthChart data={monthBuckets} />
        </ChartCard>
        <ChartCard title="Workload designer" description="Request aktif per client saat ini.">
          {workload.length === 0 ? (
            <EmptyState title="Tidak ada beban kerja aktif" />
          ) : (
            <WorkloadBarChart data={workload} />
          )}
        </ChartCard>
      </div>

      {quotaUsageData.length > 0 ? (
        <div className="mb-10">
          <ChartCard title="Pemakaian kuota per client" description="Delapan client teratas berdasarkan urutan aktif.">
            <QuotaUsageBarChart data={quotaUsageData} />
          </ChartCard>
        </div>
      ) : null}

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-ink">Client</h2>
            <p className="mt-0.5 text-sm text-muted">Status kuota tiap client, diurutkan yang aktif lebih dulu.</p>
          </div>
          <LinkButton href="/clients">Kelola semua</LinkButton>
        </div>

        {clients.length === 0 ? (
          <EmptyState title="Belum ada client" hint="Tambahkan client pertama di menu Clients." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clients.slice(0, 6).map((client) => (
              <ClientCard
                key={client.id}
                client={{
                  id: client.id,
                  company: client.company,
                  name: client.name,
                  active: client.active,
                  packageName: client.package?.name,
                  used: client.used,
                  total: client.total,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
