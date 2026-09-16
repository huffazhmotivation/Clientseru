import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/* ---------- layout ---------- */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
        {description ? <p className="mt-1 max-w-xl text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border border-dashed border-line px-5 py-10 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

/* ---------- data ---------- */

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-wash text-left">
            {head.map((cell, index) => (
              <th key={index} className="px-4 py-2.5 text-xs font-medium text-muted">
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
  return <tr className="border-b border-line last:border-b-0 hover:bg-wash">{children}</tr>;
}

export function Cell({ children, align = "left" }: { children: ReactNode; align?: "left" | "right" }) {
  return (
    <td className={`px-4 py-3 align-middle ${align === "right" ? "text-right tabular-nums" : ""}`}>{children}</td>
  );
}

export function Metric({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function QuotaBar({ used, total }: { used: number; total: number }) {
  const ratio = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div className="h-[3px] w-full bg-line" role="presentation">
      <div className="h-full bg-ink" style={{ width: `${ratio}%` }} />
    </div>
  );
}

const STATUS_LABEL: Record<string, { label: string; dot: string }> = {
  PENDING: { label: "Pending", dot: "bg-amber-500" },
  WORKING: { label: "Dikerjakan", dot: "bg-blue-500" },
  REVISION: { label: "Revisi", dot: "bg-orange-500" },
  DONE: { label: "Selesai", dot: "bg-emerald-600" },
  CANCELLED: { label: "Dibatalkan", dot: "bg-zinc-400" },
};

export function StatusTag({ status }: { status: string }) {
  const item = STATUS_LABEL[status] ?? { label: status, dot: "bg-zinc-400" };
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-ink">
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}

/* ---------- form ---------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" };

export function Button({ variant = "secondary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex h-8 items-center justify-center gap-1.5 rounded px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-ink text-white hover:bg-black",
    secondary: "border border-line bg-white text-ink hover:bg-wash",
    ghost: "text-muted hover:text-ink",
    danger: "border border-line bg-white text-red-600 hover:bg-red-50",
  } as const;
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-8 items-center rounded border border-line bg-white px-3 text-sm font-medium text-ink hover:bg-wash"
    >
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
  "w-full rounded border border-line bg-white px-2.5 py-1.5 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={`${control} ${className}`} {...rest} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea className={`${control} min-h-[90px] resize-y ${className}`} {...rest} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return <select className={`${control} ${className}`} {...rest} />;
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>;
}
