import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import { QuotaBar } from "@/components/ui";
import { cn } from "@/lib/cn";

export type ClientCardData = {
  id: string;
  company: string;
  name: string;
  active: boolean;
  packageName?: string | null;
  used: number;
  total: number;
  lastRequestTitle?: string | null;
};

export function ClientCard({ client, className }: { client: ClientCardData; className?: string }) {
  const remaining = Math.max(0, client.total - client.used);
  const initials = client.company
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/clients/${client.id}`}
      className={cn(
        "group flex flex-col gap-4 rounded-xl glass p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-raised",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-sm font-semibold text-white">
            {initials || <Building2 className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{client.company}</p>
            <p className="truncate text-xs text-muted">{client.name}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            client.active ? "bg-accentEmerald-50 text-accentEmerald-600" : "bg-wash text-subtle",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", client.active ? "bg-accentEmerald-500" : "bg-subtle")} />
          {client.active ? "Active" : "Nonaktif"}
        </span>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted">
            Kuota <span className="font-medium tabular-nums text-ink">{client.used}/{client.total}</span>
          </span>
          <span className="font-medium tabular-nums text-ink">{remaining} sisa</span>
        </div>
        <QuotaBar used={client.used} total={client.total} />
      </div>

      <div className="flex items-center justify-between border-t border-line-soft pt-3 text-xs">
        <span className="truncate text-muted">
          {client.packageName ? `Paket ${client.packageName}` : "Tanpa paket"}
          {client.lastRequestTitle ? ` · Terakhir: ${client.lastRequestTitle}` : ""}
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
      </div>
    </Link>
  );
}
