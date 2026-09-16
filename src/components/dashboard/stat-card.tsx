import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "brand" | "blue" | "emerald" | "amber" | "rose";

const TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-600",
  blue: "bg-accentBlue-50 text-accentBlue-600",
  emerald: "bg-accentEmerald-50 text-accentEmerald-600",
  amber: "bg-accentAmber-50 text-accentAmber-600",
  rose: "bg-accentRose-50 text-accentRose-600",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "brand",
  trend,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  /** positive = good/up, negative = down, 0/undefined = neutral */
  trend?: { value: number; label?: string };
  className?: string;
}) {
  const TrendIcon = !trend || trend.value === 0 ? Minus : trend.value > 0 ? ArrowUpRight : ArrowDownRight;
  const trendColor =
    !trend || trend.value === 0 ? "text-subtle" : trend.value > 0 ? "text-accentEmerald-600" : "text-accentRose-600";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-line bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", TONE_CLASSES[tone])}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        {trend ? (
          <span className={cn("inline-flex items-center gap-0.5 font-medium", trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            {Math.abs(trend.value)}
            {trend.label ? ` ${trend.label}` : ""}
          </span>
        ) : null}
        {hint ? <span className="text-muted">{hint}</span> : null}
      </div>
    </div>
  );
}
