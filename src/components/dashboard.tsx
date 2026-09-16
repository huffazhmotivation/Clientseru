"use client";

import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  FilePlus2,
  Inbox,
  Layers3,
  MoreHorizontal,
  PencilLine,
  RotateCcw,
  Sparkles,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";

const STATUS: Record<string, { label: string; className: string; icon: typeof CircleDot }> = {
  PENDING: { label: "Menunggu", className: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock3 },
  WORKING: { label: "Dikerjakan", className: "bg-blue-50 text-blue-700 ring-blue-200", icon: PencilLine },
  REVISION: { label: "Revisi", className: "bg-orange-50 text-orange-700 ring-orange-200", icon: RotateCcw },
  DONE: { label: "Selesai", className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
  CANCELLED: { label: "Dibatalkan", className: "bg-slate-100 text-slate-600 ring-slate-200", icon: CircleDot },
};

export function StatusBadge({ status }: { status: string }) {
  const item = STATUS[status] ?? STATUS.PENDING;
  if (!item) return null;
  const Icon = item.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${item.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {item.label}
    </span>
  );
}

export function StatCard({ label, value, hint, icon: Icon, tone = "indigo", trend }: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: typeof Users;
  tone?: "indigo" | "blue" | "emerald" | "amber";
  trend?: string;
}) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="surface surface-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
        {trend ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{trend}</span> : null}
      </div>
      <p className="mt-5 text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function ProgressQuotaCard({ used, total, periodLabel, compact = false }: {
  used: number;
  total: number;
  periodLabel?: string | null;
  compact?: boolean;
}) {
  const ratio = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const remaining = Math.max(0, total - used);
  const radius = compact ? 34 : 52;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (ratio / 100);
  return (
    <div className={`surface relative overflow-hidden ${compact ? "p-4" : "p-6 md:p-7"}`}>
      {!compact ? <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full border-[18px] border-indigo-50" /> : null}
      <div className="relative flex items-center gap-5">
        <div className={`relative shrink-0 ${compact ? "h-[84px] w-[84px]" : "h-32 w-32"}`}>
          <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128" role="img" aria-label={`${ratio}% kuota digunakan`}>
            <circle cx="64" cy="64" r={radius} fill="none" stroke="#e8eaf2" strokeWidth={compact ? 9 : 11} />
            <circle cx="64" cy="64" r={radius} fill="none" stroke="#635bff" strokeWidth={compact ? 9 : 11} strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`${compact ? "text-lg" : "text-2xl"} font-bold text-ink`}>{ratio}%</span>
            <span className="text-[10px] text-muted">terpakai</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">Kuota {periodLabel ?? "bulan ini"}</p>
          <p className={`${compact ? "text-xl" : "text-2xl"} mt-1 font-display font-semibold text-ink`}>{used} <span className="font-sans text-base font-normal text-muted">/ {total} desain</span></p>
          <p className="mt-2 text-sm text-muted"><span className="font-semibold text-ink">{remaining}</span> desain tersisa</p>
        </div>
      </div>
      {!compact ? (
        <div className="relative mt-6">
          <div className="mb-2 flex justify-between text-xs text-muted"><span>Penggunaan periode</span><span>{ratio}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-indigo-50"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${ratio}%` }} /></div>
          <p className="mt-3 text-xs text-muted">Kuota akan diperbarui di awal periode berikutnya.</p>
        </div>
      ) : null}
    </div>
  );
}

export function RequestCard({ request, compact = false }: { request: { id: string; title: string; description?: string | null; status: string; createdAt: Date | string; client?: { company: string } | null; quotaCost?: number }; compact?: boolean }) {
  const progress = request.status === "DONE" ? 100 : request.status === "REVISION" ? 80 : request.status === "WORKING" ? 60 : 10;
  return (
    <div className={`surface surface-hover group ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start justify-between gap-3"><StatusBadge status={request.status} /><button className="text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-label="Opsi request"><MoreHorizontal className="h-4 w-4" /></button></div>
      <h3 className="mt-4 line-clamp-1 font-semibold text-ink">{request.title}</h3>
      {request.description ? <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{request.description}</p> : null}
      <div className="mt-5"><div className="mb-2 flex justify-between text-xs text-muted"><span>Progress</span><span className="font-semibold text-ink">{progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div></div>
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-line pt-4 text-xs text-muted"><span>{request.client?.company ?? "Request desain"}</span><span>{formatDate(new Date(request.createdAt))}</span></div>
    </div>
  );
}

export function ClientCard({ client }: { client: { id: string; company: string; name: string; email: string; active: boolean; total: number; used: number; remaining: number; _count?: { requests: number } } }) {
  const initial = client.company.slice(0, 1).toUpperCase();
  const ratio = client.total > 0 ? Math.round((client.used / client.total) * 100) : 0;
  return (
    <Link href={`/clients/${client.id}`} className="surface surface-hover block p-5">
      <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-display font-semibold text-primary">{initial}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h3 className="truncate font-semibold text-ink">{client.company}</h3><ChevronRight className="h-4 w-4 shrink-0 text-muted" /></div><p className="mt-0.5 truncate text-sm text-muted">{client.name}</p></div></div>
      <div className="mt-5 flex items-center justify-between text-xs"><span className="inline-flex items-center gap-1.5 text-muted"><span className={`h-2 w-2 rounded-full ${client.active ? "bg-emerald-500" : "bg-slate-300"}`} />{client.active ? "Aktif" : "Tidak aktif"}</span><span className="font-medium text-ink">{client.remaining} kuota tersisa</span></div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${ratio}%` }} /></div>
    </Link>
  );
}

export function ActivityTimeline({ entries }: { entries: { id: string; title: string; description?: string; date: Date | string; tone?: "indigo" | "emerald" | "amber" }[] }) {
  return <div className="surface p-5"><div className="mb-5 flex items-center justify-between"><h2 className="font-semibold text-ink">Aktivitas terbaru</h2><CircleDot className="h-4 w-4 text-primary" /></div>{entries.length === 0 ? <EmptyState icon={Inbox} title="Belum ada aktivitas" hint="Aktivitas request Anda akan muncul di sini." /> : <div className="space-y-5">{entries.map((entry, index) => <div key={entry.id} className="relative flex gap-3">{index < entries.length - 1 ? <span className="absolute left-[9px] top-6 h-full w-px bg-line" /> : null}<span className={`relative mt-1 h-5 w-5 shrink-0 rounded-full ring-4 ring-white ${entry.tone === "emerald" ? "bg-emerald-100 text-emerald-600" : entry.tone === "amber" ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-primary"}`}><span className="absolute inset-1.5 rounded-full bg-current" /></span><div className="min-w-0"><p className="text-sm font-medium text-ink">{entry.title}</p><p className="mt-0.5 text-xs leading-5 text-muted">{entry.description}</p><p className="mt-1 text-[11px] text-muted">{formatDate(new Date(entry.date))}</p></div></div>)}</div>}</div>;
}

export function EmptyState({ icon: Icon = Sparkles, title, hint, action }: { icon?: typeof Sparkles; title: string; hint?: string; action?: ReactNode }) {
  return <div className="rounded-lg border border-dashed border-line bg-slate-50/60 px-5 py-10 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-primary"><Icon className="h-5 w-5" /></div><p className="mt-4 font-semibold text-ink">{title}</p>{hint ? <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted">{hint}</p> : null}{action ? <div className="mt-5">{action}</div> : null}</div>;
}

export function ChartCard({ title, description, children, className = "" }: { title: string; description?: string; children: ReactNode; className?: string }) {
  return <div className={`surface p-5 md:p-6 ${className}`}><div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="font-semibold text-ink">{title}</h2>{description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}</div><button className="rounded-lg p-1.5 text-muted hover:bg-wash hover:text-ink" aria-label="Opsi grafik"><MoreHorizontal className="h-4 w-4" /></button></div>{children}</div>;
}

export function RequestChart({ data, type = "area" }: { data: { label: string; requests: number }[]; type?: "area" | "bar" }) {
  if (data.length === 0) return <EmptyState icon={Layers3} title="Belum cukup data" hint="Grafik akan muncul setelah ada request." />;
  return <div className="h-56 w-full"><ResponsiveContainer width="100%" height="100%">{type === "bar" ? <BarChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}><CartesianGrid vertical={false} stroke="#edf0f5" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#98a2b3" }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#98a2b3" }} /><Tooltip cursor={{ fill: "#f5f7fb" }} contentStyle={{ borderRadius: 10, border: "1px solid #e5eaf2", fontSize: 12 }} /><Bar dataKey="requests" fill="#635bff" radius={[5, 5, 0, 0]} /></BarChart> : <AreaChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}><defs><linearGradient id="requestFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#635bff" stopOpacity={0.22} /><stop offset="100%" stopColor="#635bff" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0f5" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#98a2b3" }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#98a2b3" }} /><Tooltip cursor={{ stroke: "#c7c9ff" }} contentStyle={{ borderRadius: 10, border: "1px solid #e5eaf2", fontSize: 12 }} /><Area type="monotone" dataKey="requests" stroke="#635bff" strokeWidth={2.5} fill="url(#requestFill)" /></AreaChart>}</ResponsiveContainer></div>;
}

export { ArrowUpRight, BriefcaseBusiness, FilePlus2, Sparkles, Users, CheckCircle2, Clock3 };
