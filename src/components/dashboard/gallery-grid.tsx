"use client";

import { useMemo, useState } from "react";
import { Download, ExternalLink, FileText, Link2 } from "lucide-react";
import { Select, StatusTag } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";

export type GalleryItem = {
  id: string;
  type: "FILE" | "LINK";
  url: string;
  name: string;
  createdAt: string | Date;
  requestId: string;
  requestTitle: string;
  requestStatus: string;
};

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

function isImage(name: string) {
  const lower = name.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [requestFilter, setRequestFilter] = useState("");

  const requestOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) map.set(item.requestId, item.requestTitle);
    return Array.from(map.entries());
  }, [items]);

  const filtered = requestFilter ? items.filter((item) => item.requestId === requestFilter) : items;

  return (
    <>
      {requestOptions.length > 1 ? (
        <div className="mb-5 flex justify-end">
          <Select value={requestFilter} onChange={(event) => setRequestFilter(event.target.value)} className="max-w-[240px]">
            <option value="">Semua request</option>
            {requestOptions.map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => {
          const preview = item.type === "FILE" && isImage(item.name);
          return (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised"
            >
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-wash">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                ) : item.type === "LINK" ? (
                  <Link2 className="h-9 w-9 text-subtle" strokeWidth={1.5} />
                ) : (
                  <FileText className="h-9 w-9 text-subtle" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3.5">
                <p className="truncate text-sm font-medium text-ink" title={item.name}>
                  {item.name}
                </p>
                <p className="truncate text-xs text-muted" title={item.requestTitle}>
                  {item.requestTitle}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <StatusTag status={item.requestStatus} />
                  <span className="text-[11px] text-subtle">{formatDateTime(item.createdAt)}</span>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  download={item.type === "FILE" ? item.name : undefined}
                  className={cn(
                    "mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink shadow-xs transition-colors hover:border-subtle hover:bg-wash",
                  )}
                >
                  {item.type === "LINK" ? (
                    <>
                      <ExternalLink className="h-3.5 w-3.5" /> Buka link
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" /> Unduh
                    </>
                  )}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
