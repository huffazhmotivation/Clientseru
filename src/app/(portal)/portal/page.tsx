import { notFound } from "next/navigation";
import { FilePlus2, ListTodo, Loader2, RotateCcw, CheckCircle2, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/auth";
import { getClientOverview, getStudioName } from "@/lib/quota";
import { relativeDayLabel } from "@/lib/format";
import { EmptyState, LinkButton } from "@/components/ui";
import { ProgressQuotaCard } from "@/components/dashboard/progress-quota-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { RequestGrid } from "@/components/dashboard/request-grid";
import { ActivityTimeline, type ActivityItem } from "@/components/dashboard/activity-timeline";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const session = await requireClient();
  const [overview, studioName] = await Promise.all([getClientOverview(session.clientId), getStudioName(session.clientId)]);
  if (!overview) notFound();

  const [requests, history] = await Promise.all([
    prisma.designRequest.findMany({
      where: { clientId: session.clientId },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { deliverables: { orderBy: { createdAt: "desc" } } },
    }),
    prisma.quotaHistory.findMany({
      where: { clientId: session.clientId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const allRequests = await prisma.designRequest.findMany({
    where: { clientId: session.clientId },
    select: { status: true },
  });
  const counts = {
    total: allRequests.length,
    working: allRequests.filter((r) => r.status === "WORKING").length,
    done: allRequests.filter((r) => r.status === "DONE").length,
    revision: allRequests.filter((r) => r.status === "REVISION").length,
  };

  const firstName = session.name.split(" ")[0];

  // Build a lightweight, unified activity feed from requests + quota history.
  const activity: ActivityItem[] = [
    ...requests.map((r) => ({
      id: `req-${r.id}`,
      type: (r.status === "DONE" ? "done" : r.status === "REVISION" ? "revision" : "created") as ActivityItem["type"],
      title:
        r.status === "DONE"
          ? `Desain "${r.title}" ditandai selesai`
          : r.status === "REVISION"
            ? `Request "${r.title}" masuk tahap revisi`
            : `Anda mengirim request "${r.title}"`,
      timestamp: r.updatedAt,
      groupLabel: relativeDayLabel(r.updatedAt),
    })),
    ...history.map((h) => ({
      id: `hist-${h.id}`,
      type: "status" as ActivityItem["type"],
      title: h.description,
      timestamp: h.createdAt,
      groupLabel: relativeDayLabel(h.createdAt),
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-line bg-brand-gradient p-6 text-white shadow-glow sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3" />
              {overview.active ? "Layanan aktif" : "Layanan nonaktif"}
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Halo, {firstName} 👋</h1>
            <p className="mt-1.5 max-w-md text-sm text-white/80">
              Studio yang menangani akun Anda: <span className="font-medium text-white">{studioName}</span>
              {overview.package ? ` · Paket ${overview.package.name}` : ""}
            </p>
          </div>
          <LinkButton href="/portal/requests/new" variant="secondary" icon={<FilePlus2 className="h-4 w-4" />}>
            <span className="text-ink">Buat Request Desain</span>
          </LinkButton>
        </div>
      </div>

      {/* ---------- Quota ---------- */}
      <div className="mb-8">
        <ProgressQuotaCard
          used={overview.quota.usedQuota}
          total={overview.quota.totalQuota}
          periodLabel={overview.quota.periodLabel}
          resetLabel={overview.quota.periodLabel ? `Periode: ${overview.quota.periodLabel}` : undefined}
        />
      </div>

      {/* ---------- Stats ---------- */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total request" value={counts.total} icon={ListTodo} tone="brand" />
        <StatCard label="Sedang dikerjakan" value={counts.working} icon={Loader2} tone="blue" />
        <StatCard label="Selesai" value={counts.done} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Revisi" value={counts.revision} icon={RotateCcw} tone="amber" />
      </div>

      {/* ---------- Requests ---------- */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-ink">Request Desain</h2>
            <p className="mt-0.5 text-sm text-muted">6 request terbaru Anda.</p>
          </div>
          <LinkButton href="/portal/requests">Lihat semua</LinkButton>
        </div>

        {requests.length === 0 ? (
          <EmptyState
            title="Belum ada request desain"
            hint="Mulai dengan mengirim permintaan desain pertama Anda — prosesnya cuma 1 menit."
            icon={FilePlus2}
            action={<LinkButton href="/portal/requests/new" variant="primary">Buat Request Desain</LinkButton>}
          />
        ) : (
          <RequestGrid requests={requests} role="CLIENT" personLabel="Designer" personName={studioName} />
        )}
      </section>

      {/* ---------- Activity ---------- */}
      <section>
        <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">Aktivitas Terbaru</h2>
        {activity.length === 0 ? (
          <EmptyState title="Belum ada aktivitas" hint="Aktivitas akan muncul setelah Anda mulai menggunakan layanan." />
        ) : (
          <div className="rounded-xl border border-line bg-surface p-5 shadow-card">
            <ActivityTimeline items={activity} />
          </div>
        )}
      </section>
    </>
  );
}
