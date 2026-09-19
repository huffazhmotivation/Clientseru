import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Bingkai kartu grafik. Sengaja dipisah dari chart-card.tsx (yang mengimpor recharts) supaya
 *  halaman server bisa memakainya tanpa ikut menarik library grafik ke bundle awal. */
export function ChartCard({
  title,
  description,
  action,
  className,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl glass p-5 shadow-card", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
