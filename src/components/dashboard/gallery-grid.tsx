"use client";

import { useMemo, useState } from "react";
import { Download, Expand, ExternalLink } from "lucide-react";
import { Select, StatusTag } from "@/components/ui";
import { getFileKind, ImageLightbox } from "@/components/file-preview";
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

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [requestFilter, setRequestFilter] = useState("");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

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
          const kind = getFileKind(item.name, item.type);
          return (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl glass shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-raised"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-wash/70">
                {kind === "image" ? (
                  <button
                    type="button"
                    onClick={() => setLightbox(item)}
                    className="group/thumb relative block h-full w-full"
                    aria-label={`Lihat ${item.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover/thumb:bg-ink/30">
                      <Expand className="h-5 w-5 text-white opacity-0 transition-opacity group-hover/thumb:opacity-100" />
                    </span>
                  </button>
                ) : kind === "pdf" ? (
                  <div className="pointer-events-none absolute inset-0 bg-white">
                    <iframe
                      src={`${item.url}#view=FitH`}
                      tabIndex={-1}
                      aria-hidden
                      className="absolute left-0 top-0 h-[230%] w-[230%] origin-top-left scale-[0.435]"
                    />
                  </div>
                ) : (
                  <FileTypeGlyph kind={kind} />
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
                    "mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg glass px-3 py-1.5 text-xs font-medium text-ink shadow-xs transition-colors hover:bg-white/80",
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

      {lightbox ? <ImageLightbox src={lightbox.url} name={lightbox.name} onClose={() => setLightbox(null)} /> : null}
    </>
  );
}

function FileTypeGlyph({ kind }: { kind: string }) {
  const label = kind === "link" ? "LINK" : kind.toUpperCase();
  return (
    <div className="flex flex-col items-center gap-1.5 text-subtle">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/60 text-[10px] font-bold tracking-wide shadow-inner-glass">
        {label.slice(0, 4)}
      </span>
    </div>
  );
}
