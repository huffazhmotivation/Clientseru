import type { LucideIcon } from "lucide-react";
import { CheckCircle2, FilePlus2, MessageSquareText, RotateCcw, UploadCloud } from "lucide-react";
import { cn } from "@/lib/cn";

export type ActivityItem = {
  id: string;
  type: "created" | "status" | "revision" | "done" | "note";
  title: string;
  timestamp: Date | string;
  groupLabel: string; // "Hari ini", "Kemarin", "12 September"
};

const ICON_BY_TYPE: Record<ActivityItem["type"], LucideIcon> = {
  created: FilePlus2,
  status: UploadCloud,
  revision: RotateCcw,
  done: CheckCircle2,
  note: MessageSquareText,
};

const TONE_BY_TYPE: Record<ActivityItem["type"], string> = {
  created: "bg-brand-50 text-brand-600",
  status: "bg-accentBlue-50 text-accentBlue-600",
  revision: "bg-accentAmber-50 text-accentAmber-600",
  done: "bg-accentEmerald-50 text-accentEmerald-600",
  note: "bg-wash text-muted",
};

const timeFormatter = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" });

export function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  const groups = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const list = groups.get(item.groupLabel) ?? [];
    list.push(item);
    groups.set(item.groupLabel, list);
  }

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([label, groupItems]) => (
        <div key={label}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-subtle">{label}</p>
          <ul className="space-y-0">
            {groupItems.map((item, index) => {
              const Icon = ICON_BY_TYPE[item.type];
              const isLast = index === groupItems.length - 1;
              return (
                <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
                  {!isLast ? <span className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-line" /> : null}
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", TONE_BY_TYPE[item.type])}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </span>
                  <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3 pt-1">
                    <p className="text-sm text-ink">{item.title}</p>
                    <span className="shrink-0 text-xs tabular-nums text-subtle">{timeFormatter.format(new Date(item.timestamp))}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
