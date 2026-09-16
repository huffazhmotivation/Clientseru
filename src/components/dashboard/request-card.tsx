import { CalendarDays, Paperclip, User2 } from "lucide-react";
import { StatusTag } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const PROGRESS_BY_STATUS: Record<string, number> = {
  PENDING: 10,
  WORKING: 60,
  REVISION: 80,
  DONE: 100,
  CANCELLED: 0,
};

export type RequestCardData = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  createdAt: Date | string;
  quotaCost: number;
  briefUrl?: string | null;
  referenceUrl?: string | null;
};

export function RequestCard({
  request,
  personLabel,
  personName,
  right,
  className,
}: {
  request: RequestCardData;
  /** e.g. "Designer" on client view, "Client" on designer view */
  personLabel?: string;
  personName?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  const progress = PROGRESS_BY_STATUS[request.status] ?? 0;
  const hasAttachment = Boolean(request.briefUrl || request.referenceUrl);

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{request.title}</p>
          {request.description ? (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted">{request.description}</p>
          ) : null}
        </div>
        <StatusTag status={request.status} />
      </div>

      {request.status !== "CANCELLED" ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-wash">
          <div
            className="h-full rounded-full bg-brand-500 transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-subtle">
        <div className="flex flex-wrap items-center gap-3">
          {personName ? (
            <span className="inline-flex items-center gap-1">
              <User2 className="h-3.5 w-3.5" />
              {personLabel ? `${personLabel}: ` : ""}
              {personName}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(request.createdAt)}
          </span>
          {hasAttachment ? (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="h-3.5 w-3.5" />
              Lampiran
            </span>
          ) : null}
        </div>
        {right}
      </div>
    </div>
  );
}
