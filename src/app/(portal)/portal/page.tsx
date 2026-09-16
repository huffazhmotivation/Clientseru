import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, FilePlus2, Sparkles, StatCard, ProgressQuotaCard, RequestCard, ActivityTimeline } from "@/components/dashboard";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/auth";
import { getClientOverview } from "@/lib/quota";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const session = await requireClient();
  const overview = await getClientOverview(session.clientId);
  if (!overview) return null;
  const [requests, counts, history] = await Promise.all([
    prisma.designRequest.findMany({ where: { clientId: session.clientId }, orderBy: { createdAt: "desc" }, take: 4 }),
    Promise.all(["PENDING", "WORKING", "REVISION", "DONE"].map((status) => prisma.designRequest.count({ where: { clientId: session.clientId, status: status as never } }))),
    prisma.quotaHistory.findMany({ where: { clientId: session.clientId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const [pending = 0, working = 0, revision = 0, done = 0] = counts;
  const activities = history.map((entry) => ({ id: entry.id, title: entry.type === "USAGE" ? "Kuota digunakan" : entry.type === "TOPUP" ? "Kuota ditambahkan" : "Kuota disesuaikan", description: entry.description, date: entry.createdAt, tone: entry.type === "TOPUP" ? "emerald" as const : entry.type === "USAGE" ? "indigo" as const : "amber" as const }));
  return <div>
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-medium text-primary">Ringkasan workspace</p><h1 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">Halo, {session.name.split(" ")[0]} <span aria-hidden="true">👋</span></h1><p className="mt-2 text-sm text-muted">Pantau request dan kuota desain Anda di satu tempat.</p></div><Link href="/portal/requests/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(99,91,255,0.2)] transition-colors hover:bg-primary-dark"><FilePlus2 className="h-4 w-4" />Buat request desain</Link></div>
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]"><ProgressQuotaCard used={overview.quota.usedQuota} total={overview.quota.totalQuota} periodLabel={overview.quota.periodLabel} /><div className="surface flex flex-col justify-between p-6"><div><div className="flex items-center gap-2 text-sm font-medium text-muted"><span className="h-2 w-2 rounded-full bg-emerald-500" />Layanan aktif</div><h2 className="mt-4 font-display text-2xl font-semibold text-ink">{overview.package?.name ?? "Creative partnership"}</h2><p className="mt-2 text-sm leading-6 text-muted">{overview.company} · Tim designer siap membantu kebutuhan visual Anda.</p></div><div className="mt-7 border-t border-line pt-4"><div className="flex items-center justify-between text-xs text-muted"><span>Periode saat ini</span><span className="font-medium text-ink">{overview.quota.periodLabel ?? "Bulan ini"}</span></div><div className="mt-3 flex items-center gap-2 text-xs text-primary"><Sparkles className="h-3.5 w-3.5" />Prioritas request terjaga</div></div></div></div>
    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"><StatCard label="Total request" value={pending + working + revision + done} hint="Sepanjang waktu" icon={BriefcaseBusiness} tone="indigo" /><StatCard label="Sedang dikerjakan" value={working} hint="Dalam antrean tim" icon={FilePlus2} tone="blue" /><StatCard label="Selesai" value={done} hint="Desain terkirim" icon={CheckCircle2} tone="emerald" /><StatCard label="Revisi" value={revision} hint="Menunggu arahan" icon={ArrowUpRight} tone="amber" /></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]"><section><div className="mb-4 flex items-center justify-between"><div><h2 className="font-display text-xl font-semibold text-ink">Request terbaru</h2><p className="mt-1 text-sm text-muted">Pekerjaan yang sedang berjalan bersama tim.</p></div><Link href="/portal/requests" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">Lihat semua <ArrowUpRight className="h-4 w-4" /></Link></div>{requests.length === 0 ? <div className="surface p-4"><div className="rounded-lg"><p className="font-semibold text-ink">Belum ada request desain</p><p className="mt-1 text-sm text-muted">Mulai dengan mengirim brief pertama Anda.</p><Link href="/portal/requests/new" className="mt-4 inline-flex text-sm font-semibold text-primary">Kirim request <ArrowUpRight className="ml-1 h-4 w-4" /></Link></div></div> : <div className="grid gap-4 sm:grid-cols-2">{requests.map((request) => <RequestCard key={request.id} request={request} compact />)}</div>}</section><ActivityTimeline entries={activities} /></div>
  </div>;
}
