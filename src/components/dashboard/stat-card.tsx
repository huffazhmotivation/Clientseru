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
  featured = false,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  /** positive = good/up, negative = down, 0/undefined = neutral */
  trend?: { value: number; label?: string };
  className?: string;
  /** Hero tile for a bento layout — vivid gradient fill instead of the flat glass card. */
  featured?: boolean;
}) {
  // Angka panjang (mis. "Rp 500.000") harus mengecil supaya tidak terpotong di kartu sempit.
  const valueLength = typeof value === "string" || typeof value === "number" ? String(value).length : 0;
  const valueSize = featured
    ? "text-4xl"
    : valueLength <= 6
      ? "text-3xl"
      : valueLength <= 10
        ? "text-2xl"
        : valueLength <= 13
          ? "text-xl"
          : "text-lg";

  const TrendIcon = !trend || trend.value === 0 ? Minus : trend.value > 0 ? ArrowUpRight : ArrowDownRight;
  const trendColor =
    !trend || trend.value === 0
      ? "text-subtle"
      : trend.value > 0
        ? featured
          ? "text-white"
          : "text-accentEmerald-500"
        : featured
          ? "text-white"
          : "text-accentRose-500";

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl p-5 shadow-card transition-[transform,background-color,border-color,color,opacity] duration-200 hover:-translate-y-0.5 hover:shadow-raised",
        featured ? "bg-brand-gradient text-white shadow-glow" : "glass",
        className,
      )}
    >
      {featured ? (
        <span className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15 blur-3xl" />
      ) : null}
      <div className="relative flex items-start justify-between">
        <p className={cn("text-xs font-medium uppercase tracking-wide", featured ? "text-white/70" : "text-subtle")}>
          {label}
        </p>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            featured ? "bg-white/15 text-white" : TONE_CLASSES[tone],
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
      </div>
      <div className="relative">
        <p
          className={cn(
            "mt-3 whitespace-nowrap font-semibold tracking-tight tabular-nums",
            valueSize,
            featured ? "text-white" : "text-ink",
          )}
        >
          {value}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {trend ? (
            <span className={cn("inline-flex items-center gap-0.5 font-medium", trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {Math.abs(trend.value)}
              {trend.label ? ` ${trend.label}` : ""}
            </span>
          ) : null}
          {hint ? <span className={featured ? "text-white/70" : "text-muted"}>{hint}</span> : null}
        </div>
      </div>
    </div>
  );
}
