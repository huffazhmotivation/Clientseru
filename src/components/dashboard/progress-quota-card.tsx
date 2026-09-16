import { CalendarClock, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

function toneFor(ratio: number) {
  if (ratio >= 90) return { ring: "#f43f5e", soft: "#fff1f2", text: "text-accentRose-600" };
  if (ratio >= 70) return { ring: "#f59e0b", soft: "#fffbeb", text: "text-accentAmber-600" };
  return { ring: "#6f5cf0", soft: "#f2f1ff", text: "text-brand-600" };
}

export function DonutQuota({ used, total, size = 128 }: { used: number; total: number; size?: number }) {
  const ratio = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const tone = toneFor(ratio);
  const stroke = size * 0.11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ratio / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef0f4" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone.ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight text-ink">{ratio}%</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-subtle">terpakai</span>
      </div>
    </div>
  );
}

export function ProgressQuotaCard({
  used,
  total,
  resetLabel,
  periodLabel,
  className,
}: {
  used: number;
  total: number;
  /** e.g. "Reset 1 Oktober 2026" */
  resetLabel?: string;
  periodLabel?: string | null;
  className?: string;
}) {
  const remaining = Math.max(0, total - used);
  const ratio = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const tone = toneFor(ratio);

  // Rough "days you can still request at current pace" style estimate — purely illustrative.
  const estimateLabel =
    remaining <= 0
      ? "Kuota sudah habis"
      : remaining <= 3
        ? `Sisa sedikit — pakai secukupnya`
        : `Cukup untuk ~${remaining} request lagi`;

  return (
    <div className={cn("rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-subtle">Kuota Bulanan</p>
          {periodLabel ? <p className="mt-0.5 text-sm font-medium text-ink">{periodLabel}</p> : null}
        </div>
        <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", tone.text)} style={{ background: tone.soft }}>
          <Sparkles className="h-3 w-3" />
          {estimateLabel}
        </span>
      </div>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <DonutQuota used={used} total={total} />

        <div className="w-full flex-1 space-y-3">
          <div className="flex items-end justify-between">
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-ink">
              {used} <span className="text-base font-normal text-muted">/ {total} desain digunakan</span>
            </p>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-wash">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${ratio}%`, background: tone.ring }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
            <span className="text-muted">
              Sisa <span className="font-semibold tabular-nums text-ink">{remaining}</span> desain
            </span>
            {resetLabel ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                <CalendarClock className="h-3.5 w-3.5" />
                {resetLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
