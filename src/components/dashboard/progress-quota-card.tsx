import { CalendarClock, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

function toneFor(ratio: number) {
  if (ratio >= 90) return { ring: "#f2478e", soft: "rgba(242,71,142,0.14)", text: "text-accentRose-500" };
  if (ratio >= 70) return { ring: "#f0a71f", soft: "rgba(240,167,31,0.14)", text: "text-accentAmber-500" };
  return { ring: "#8f5cff", soft: "rgba(124,58,237,0.16)", text: "text-brand-300" };
}

export function DonutQuota({ used, total, size = 128 }: { used: number; total: number; size?: number }) {
  const ratio = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const remaining = Math.max(0, total - used);
  const tone = toneFor(ratio);
  const stroke = size * 0.11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ratio / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
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
      {/* Center shows remaining slots (not the % used) so the client sees
          at a glance how many requests they have left, without doing math. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums tracking-tight text-ink">{remaining}</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-subtle">tersisa</span>
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
    <div className={cn("rounded-xl glass p-5 shadow-card sm:p-6", className)}>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-subtle">Kuota Bulanan</p>
          {periodLabel ? <p className="mt-0.5 text-sm font-medium text-ink">{periodLabel}</p> : null}
        </div>
        <span
          className={cn("inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium", tone.text)}
          style={{ background: tone.soft }}
        >
          <Sparkles className="h-3 w-3 shrink-0" />
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
