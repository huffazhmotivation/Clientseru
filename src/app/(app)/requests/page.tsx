import Link from "next/link";
import { ArrowUpRight, EmptyState, RequestCard, StatusBadge } from "@/components/dashboard";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { StatusSelect } from "@/components/status-select";

export const dynamic = "force-dynamic";

const COLUMNS = [
  { status: "PENDING", label: "Pending", color: "border-amber-200 bg-amber-50/40" },
  { status: "WORKING", label: "Working", color: "border-blue-200 bg-blue-50/40" },
  { status: "REVISION", label: "Revision", color: "border-orange-200 bg-orange-50/40" },
  { status: "DONE", label: "Done", color: "border-emerald-200 bg-emerald-50/40" },
];

export default async function RequestsPage() {
  const requests = await prisma.designRequest.findMany({ orderBy: [{ createdAt: "desc" }], include: { client: { select: { company: true } } } });
  return <div>
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-medium text-primary">Design pipeline</p><h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Request workspace</h1><p className="mt-2 text-sm text-muted">Pindahkan fokus dari satu request ke request berikutnya.</p></div><div className="text-sm text-muted"><span className="font-semibold text-ink">{requests.length}</span> total request</div></div>
    {requests.length === 0 ? <EmptyState title="Belum ada request masuk" hint="Request dari client akan muncul di workspace ini." /> : <div className="grid gap-4 overflow-x-auto pb-4 md:grid-cols-2 xl:grid-cols-4">{COLUMNS.map((column) => { const items = requests.filter((request) => request.status === column.status); return <section key={column.status} className={`min-w-[270px] rounded-xl border p-3 ${column.color}`}><div className="mb-4 flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-current" /><h2 className="text-xs font-bold tracking-wide text-ink">{column.label}</h2></div><span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold text-muted">{items.length}</span></div><div className="space-y-3">{items.length === 0 ? <div className="rounded-lg border border-dashed border-line bg-white/50 px-3 py-8 text-center text-xs text-muted">Kolom kosong</div> : items.map((request) => <article key={request.id} className="surface p-4"><div className="flex items-start justify-between gap-2"><StatusBadge status={request.status} /><span className="text-[11px] text-muted">{formatDate(request.createdAt)}</span></div><h3 className="mt-3 line-clamp-2 text-sm font-semibold text-ink">{request.title}</h3><p className="mt-1 truncate text-xs text-muted">{request.client.company}</p><div className="mt-4"><StatusSelect requestId={request.id} status={request.status} /></div><div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[11px] text-muted"><span>{request.quotaCost} kuota</span><Link href={`/clients`} className="inline-flex items-center gap-1 font-semibold text-primary">Detail <ArrowUpRight className="h-3 w-3" /></Link></div></article>)}</div></section>; })}</div>}
  </div>;
}
