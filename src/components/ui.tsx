import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileQuestion,
  Loader2,
  RotateCcw,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

/* =========================================================
   LAYOUT PRIMITIVES
   ========================================================= */

export function PageHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <header className="mb-9 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
            <span className="h-1 w-1 rounded-full bg-brand-500" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">{title}</h1>
        {description ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </header>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-10", className)}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg font-medium tracking-tight text-ink">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Card: frosted glass surface used everywhere — replaces flat bordered <div>. */
export function Card({
  children,
  className,
  padded = true,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-xl shadow-card",
        padded && "p-5",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised hover:bg-white/70",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  icon: Icon = FileQuestion,
  action,
}: {
  title: string;
  hint?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="glass-faint flex flex-col items-center justify-center rounded-xl border-dashed px-6 py-14 text-center animate-fade-in">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient-soft text-brand-600 shadow-inner-glass">
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
      </div>
      <p className="font-serif text-base font-medium text-ink">{title}</p>
      {hint ? <p className="mt-1.5 max-w-sm text-sm text-muted">{hint}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/* =========================================================
   DATA DISPLAY
   ========================================================= */

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="glass overflow-x-auto rounded-xl shadow-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line/70 bg-white/30 text-left">
            {head.map((cell, index) => (
              <th key={index} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-subtle">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <tr className="border-b border-line-soft/70 last:border-b-0 transition-colors hover:bg-white/40">{children}</tr>;
}

export function Cell({ children, align = "left" }: { children: ReactNode; align?: "left" | "right" }) {
  return <td className={cn("px-4 py-3.5 align-middle", align === "right" && "text-right tabular-nums")}>{children}</td>;
}

export function Metric({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</p>
      <p className="mt-1.5 font-serif text-2xl font-medium tabular-nums tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function QuotaBar({ used, total, className }: { used: number; total: number; className?: string }) {
  const ratio = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const tone = ratio >= 90 ? "bg-accentRose-500" : ratio >= 70 ? "bg-clay-500" : "bg-brand-500";
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-wash", className)} role="presentation">
      <div
        className={cn("h-full rounded-full transition-[width] duration-500 ease-out", tone)}
        style={{ width: `${ratio}%` }}
      />
    </div>
  );
}

export const STATUS_META: Record<
  string,
  { label: string; icon: LucideIcon; classes: string; dot: string }
> = {
  PENDING: { label: "Pending", icon: Clock, classes: "bg-accentAmber-50 text-accentAmber-600", dot: "bg-accentAmber-500" },
  WORKING: { label: "Dikerjakan", icon: Loader2, classes: "bg-accentBlue-50 text-accentBlue-600", dot: "bg-accentBlue-500" },
  REVISION: { label: "Revisi", icon: RotateCcw, classes: "bg-brand-50 text-brand-600", dot: "bg-brand-500" },
  DONE: { label: "Selesai", icon: CheckCircle2, classes: "bg-accentEmerald-50 text-accentEmerald-600", dot: "bg-accentEmerald-500" },
  CANCELLED: { label: "Dibatalkan", icon: XCircle, classes: "bg-wash text-subtle", dot: "bg-subtle" },
};

export function StatusTag({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, icon: AlertTriangle, classes: "bg-wash text-muted", dot: "bg-subtle" };
  const Icon = meta.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium", meta.classes)}>
      <Icon className={cn("h-3 w-3", status === "WORKING" && "animate-spin")} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

/* =========================================================
   FORM PRIMITIVES
   ========================================================= */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
};

export function Button({ variant = "secondary", size = "md", icon, className = "", children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-[38px] px-4 text-sm" } as const;
  const variants = {
    primary: "bg-ink text-white shadow-card hover:bg-brand-700 hover:shadow-glow",
    secondary: "glass text-ink shadow-xs hover:bg-white/80 hover:shadow-card",
    ghost: "text-muted hover:bg-white/50 hover:text-ink",
    danger: "border border-accentRose-100 bg-white/60 text-accentRose-600 backdrop-blur-md hover:bg-accentRose-50",
  } as const;
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {icon}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "secondary",
  icon,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
}) {
  const variants = {
    primary: "bg-ink text-white shadow-card hover:bg-brand-700 hover:shadow-glow",
    secondary: "glass text-ink shadow-xs hover:bg-white/80 hover:shadow-card",
  } as const;
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-[38px] items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-all duration-150 active:scale-[0.98]",
        variants[variant],
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

const control =
  "w-full rounded-lg border border-line/80 bg-white/55 backdrop-blur-md px-3 py-2 text-sm text-ink shadow-xs transition-colors placeholder:text-subtle focus:border-brand-500 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-brand-100";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={cn(control, className)} {...rest} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea className={cn(control, "min-h-[90px] resize-y", className)} {...rest} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return <select className={cn(control, "cursor-pointer", className)} {...rest} />;
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="flex items-start gap-2 rounded-lg border border-accentRose-100 bg-accentRose-50/80 backdrop-blur-sm px-3 py-2.5 text-sm text-accentRose-600 animate-fade-in">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}

/* =========================================================
   SKELETONS
   ========================================================= */

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("skeleton h-3.5 rounded-full", className)} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass rounded-xl p-5 shadow-card", className)}>
      <SkeletonLine className="mb-3 w-24" />
      <SkeletonLine className="mb-2 h-6 w-16" />
      <SkeletonLine className="w-32" />
    </div>
  );
}
