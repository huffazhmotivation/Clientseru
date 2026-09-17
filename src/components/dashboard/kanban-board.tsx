"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, FolderCheck, GripVertical, Paperclip } from "lucide-react";
import { send } from "@/lib/client-api";
import { formatDate } from "@/lib/format";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/cn";
import { RequestDetailDialog, type DeliverableData } from "@/components/dashboard/request-detail-dialog";

export type KanbanRequest = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  quotaCost: number;
  createdAt: string | Date;
  briefUrl: string | null;
  referenceUrl: string | null;
  client: { id: string; company: string };
  deliverables: DeliverableData[];
};

const COLUMNS: { key: string; label: string; accent: string; dot: string }[] = [
  { key: "PENDING", label: "Pending", accent: "border-t-accentAmber-500", dot: "bg-accentAmber-500" },
  { key: "WORKING", label: "Working", accent: "border-t-accentBlue-500", dot: "bg-accentBlue-500" },
  { key: "REVISION", label: "Revision", accent: "border-t-brand-500", dot: "bg-brand-500" },
  { key: "DONE", label: "Done", accent: "border-t-accentEmerald-500", dot: "bg-accentEmerald-500" },
];

export function KanbanBoard({ requests }: { requests: KanbanRequest[] }) {
  const router = useRouter();
  const { push } = useToast();
  const [items, setItems] = useState(requests);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const selected = items.find((item) => item.id === selectedId) ?? null;

  // Keep local board state in sync with fresh server data (e.g. after router.refresh()
  // triggered by a status change or deliverable upload inside the detail dialog).
  useEffect(() => {
    setItems(requests);
  }, [requests]);

  const byColumn = useMemo(() => {
    const map = new Map<string, KanbanRequest[]>();
    for (const column of COLUMNS) map.set(column.key, []);
    for (const item of items) {
      if (!map.has(item.status)) continue;
      map.get(item.status)!.push(item);
    }
    return map;
  }, [items]);

  async function moveTo(id: string, status: string) {
    const current = items.find((item) => item.id === id);
    if (!current || current.status === status) return;

    const previous = items;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));

    try {
      await send(`/api/requests/${id}`, "PATCH", { status });
      push({ kind: "success", title: "Status diperbarui", description: `${current.title} → ${status}` });
      startTransition(() => router.refresh());
    } catch (err) {
      setItems(previous);
      push({
        kind: "error",
        title: "Gagal memindahkan status",
        description: err instanceof Error ? err.message : undefined,
      });
    }
  }

  return (
    <>
    <div className="grid grid-cols-1 gap-4 overflow-x-auto pb-2 sm:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((column) => {
        const columnItems = byColumn.get(column.key) ?? [];
        const isOver = overColumn === column.key;
        return (
          <div
            key={column.key}
            onDragOver={(event) => {
              event.preventDefault();
              setOverColumn(column.key);
            }}
            onDragLeave={() => setOverColumn((prev) => (prev === column.key ? null : prev))}
            onDrop={(event) => {
              event.preventDefault();
              setOverColumn(null);
              if (dragId) moveTo(dragId, column.key);
            }}
            className={cn(
              "flex min-h-[220px] flex-col rounded-xl border border-t-4 border-line bg-wash/50 p-3 transition-colors",
              column.accent,
              isOver && "bg-brand-50/60 ring-2 ring-brand-200",
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", column.dot)} />
                <p className="text-sm font-semibold text-ink">{column.label}</p>
              </div>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-muted shadow-xs">
                {columnItems.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2.5">
              {columnItems.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-line/80 py-8 text-xs text-subtle">
                  Kosong
                </div>
              ) : (
                columnItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDragId(item.id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => setSelectedId(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedId(item.id);
                      }
                    }}
                    className={cn(
                      "group cursor-grab space-y-2.5 rounded-lg border border-line bg-white p-3.5 shadow-card transition-all active:cursor-grabbing",
                      dragId === item.id ? "opacity-40" : "hover:-translate-y-0.5 hover:shadow-raised",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-ink">{item.title}</p>
                      <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <Link
                      href={`/clients/${item.client.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="inline-block text-xs font-medium text-brand-600 hover:underline"
                    >
                      {item.client.company}
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-subtle">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </span>
                      {(item.briefUrl || item.referenceUrl) && (
                        <span className="inline-flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          Lampiran
                        </span>
                      )}
                      {item.deliverables.length > 0 && (
                        <span className="inline-flex items-center gap-1 font-medium text-accentEmerald-600">
                          <FolderCheck className="h-3 w-3" />
                          {item.deliverables.length} hasil
                        </span>
                      )}
                      <span className="ml-auto font-medium text-ink">{item.quotaCost} kuota</span>
                    </div>

                    {/* Quick-move controls for touch / accessibility, since drag-drop is mouse-first */}
                    <div
                      className="flex flex-wrap gap-1 border-t border-line-soft pt-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {COLUMNS.filter((c) => c.key !== item.status).map((c) => (
                        <button
                          key={c.key}
                          onClick={() => moveTo(item.id, c.key)}
                          className="rounded-md px-2 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-wash hover:text-ink"
                        >
                          → {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
      </div>

      <RequestDetailDialog
        key={selected?.id ?? "none"}
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        request={selected}
        role="DESIGNER"
      />
    </>
  );
}
