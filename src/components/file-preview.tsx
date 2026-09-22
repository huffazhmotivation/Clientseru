"use client";

import { useEffect, useRef, useState } from "react";
import {
  Archive,
  Download,
  Expand,
  ExternalLink,
  File as FileIcon,
  FileSpreadsheet,
  FileText,
  Film,
  Link2,
  Music,
  Presentation,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

/* =========================================================
   File-kind detection — purely by extension, since attachments
   are only ever known by name/url on the client.
   ========================================================= */

export type FileKind = "image" | "pdf" | "doc" | "sheet" | "slide" | "archive" | "audio" | "video" | "link" | "other";

const EXT_MAP: Record<string, FileKind> = {
  png: "image", jpg: "image", jpeg: "image", webp: "image", gif: "image", svg: "image", avif: "image",
  pdf: "pdf",
  doc: "doc", docx: "doc", rtf: "doc", txt: "doc",
  xls: "sheet", xlsx: "sheet", csv: "sheet",
  ppt: "slide", pptx: "slide", key: "slide",
  zip: "archive", rar: "archive", "7z": "archive",
  mp3: "audio", wav: "audio", m4a: "audio",
  mp4: "video", mov: "video", webm: "video",
};

export function getFileKind(name: string, type: "FILE" | "LINK" = "FILE"): FileKind {
  if (type === "LINK") return "link";
  const ext = name.split(".").pop()?.toLowerCase().trim() ?? "";
  return EXT_MAP[ext] ?? "other";
}

const KIND_META: Record<FileKind, { icon: LucideIcon; classes: string; label: string }> = {
  image: { icon: FileIcon, classes: "bg-brand-50 text-brand-600", label: "Gambar" },
  pdf: { icon: FileText, classes: "bg-accentRose-50 text-accentRose-600", label: "PDF" },
  doc: { icon: FileText, classes: "bg-accentBlue-50 text-accentBlue-600", label: "Dokumen" },
  sheet: { icon: FileSpreadsheet, classes: "bg-accentEmerald-50 text-accentEmerald-600", label: "Spreadsheet" },
  slide: { icon: Presentation, classes: "bg-clay-100 text-clay-600", label: "Presentasi" },
  archive: { icon: Archive, classes: "bg-wash text-muted", label: "Arsip" },
  audio: { icon: Music, classes: "bg-clay-100 text-clay-600", label: "Audio" },
  video: { icon: Film, classes: "bg-accentBlue-50 text-accentBlue-600", label: "Video" },
  link: { icon: Link2, classes: "bg-accentBlue-50 text-accentBlue-600", label: "Link" },
  other: { icon: FileIcon, classes: "bg-wash text-muted", label: "File" },
};

function extensionLabel(name: string) {
  const ext = name.split(".").pop()?.toUpperCase();
  return ext && ext.length <= 5 ? ext : "FILE";
}

/* =========================================================
   Lightbox — click an image thumbnail to see it full-size,
   without leaving the page.
   ========================================================= */

export function ImageLightbox({ src, name, onClose }: { src: string; name: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 animate-fade-in sm:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-full max-w-full flex-col items-center gap-3 animate-scale-in">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          decoding="async"
          className="max-h-[78vh] max-w-full rounded-lg object-contain shadow-popover"
        />
        <div className="glass-strong flex max-w-full items-center gap-3 rounded-full px-4 py-2 shadow-raised">
          <span className="max-w-[40vw] truncate text-xs font-medium text-ink">{name}</span>
          <a
            href={src}
            download={name}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-brand-400 hover:bg-brand-500/15"
          >
            <Download className="h-3.5 w-3.5" /> Unduh
          </a>
        </div>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="glass-strong absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full text-ink shadow-raised transition-transform hover:scale-105"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   LazyPdfThumb — a scaled-down live render of a PDF's first page,
   used as a thumbnail. Rendering a PDF inside an <iframe> is heavy
   (full download + the browser's PDF engine boots up), so we only
   mount the iframe once the thumbnail actually scrolls near the
   viewport instead of doing it for every attachment up front —
   this is what was causing noticeable lag when opening a panel or
   gallery that has several PDF attachments.
   ========================================================= */

export function LazyPdfThumb({ url }: { url: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible || !ref.current) return;
    const el = ref.current;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          // Tunda sebentar: booting viewer PDF di dalam iframe itu berat. Kalau langsung
          // dimulai saat dialog baru terbuka, animasi & klik berikutnya ikut tersendat.
          timer = setTimeout(() => setVisible(true), 350);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [visible]);

  return (
    <div ref={ref} className="relative h-full w-full bg-white">
      {visible ? (
        <iframe
          src={`${url}#view=FitH`}
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-[230%] w-[230%] origin-top-left scale-[0.435]"
        />
      ) : null}
    </div>
  );
}

/* =========================================================
   AttachmentCard — the core "file preview" unit. Real thumbnail
   for images, a live scaled-down render for PDFs, and a clean
   colour-coded icon card for everything else. Used for both
   designer deliverables and client brief/reference uploads.
   ========================================================= */

export function AttachmentCard({
  name,
  url,
  type = "FILE",
  meta,
  onRemove,
  removing,
  size = "md",
  className,
}: {
  name: string;
  url: string;
  type?: "FILE" | "LINK";
  meta?: string;
  onRemove?: () => void;
  removing?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const kind = getFileKind(name, type);
  const info = KIND_META[kind];
  const Icon = info.icon;
  const [lightbox, setLightbox] = useState(false);
  // When the display name has no recognisable extension (e.g. generic "Berkas
  // brief" labels for client uploads), still try rendering it as an image —
  // most briefs/references are screenshots — and quietly fall back to the
  // icon card if that guess turns out wrong.
  const [guessFailed, setGuessFailed] = useState(false);
  const tryImageGuess = kind === "other" && type === "FILE" && !guessFailed;
  const thumbSize = size === "sm" ? "h-11 w-11" : "h-14 w-14";

  return (
    <>
      <div
        className={cn(
          // min-w-0: tanpa ini, item grid/flex tidak mau menyusut lebih kecil dari
          // konten aslinya, jadi nama file yang panjang & tanpa spasi bikin seluruh
          // kartu melebar dan panel harus discroll ke samping. Dengan min-w-0, lebar
          // kartu mengikuti kolomnya dan nama filenya yang dipotong (truncate) di bawah.
          "group flex min-w-0 items-center gap-3 rounded-lg border border-edge/15 bg-edge/[0.06] p-2.5 shadow-xs transition-[transform,background-color,border-color,color,opacity] duration-200 hover:border-edge/20 hover:bg-edge/10 hover:shadow-card",
          className,
        )}
      >
        <div className={cn("relative shrink-0 overflow-hidden rounded-md shadow-inner-glass", thumbSize, info.classes)}>
          {kind === "image" || tryImageGuess ? (
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="group/thumb relative block h-full w-full"
              aria-label={`Lihat ${name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={name}
                loading="lazy"
                decoding="async"
                onError={() => setGuessFailed(true)}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover/thumb:bg-black/45">
                <Expand className="h-3.5 w-3.5 text-white opacity-0 transition-opacity group-hover/thumb:opacity-100" />
              </span>
            </button>
          ) : kind === "pdf" ? (
            <LazyPdfThumb url={url} />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-0.5">
              <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.75} />
              {size !== "sm" ? <span className="text-[8.5px] font-bold tracking-wide opacity-80">{extensionLabel(name)}</span> : null}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink" title={name}>
            {name}
          </p>
          <p className="truncate text-[11px] text-subtle">{meta ?? info.label}</p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            download={type === "FILE" ? name : undefined}
            aria-label={type === "LINK" ? "Buka link" : "Unduh file"}
            className="rounded-md p-1.5 text-subtle transition-colors hover:bg-brand-500/15 hover:text-brand-400"
          >
            {type === "LINK" ? <ExternalLink className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
          </a>
          {onRemove ? (
            <button
              onClick={onRemove}
              disabled={removing}
              aria-label="Hapus lampiran"
              className="rounded-md p-1.5 text-subtle transition-colors hover:bg-accentRose-500/15 hover:text-accentRose-500 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {lightbox ? <ImageLightbox src={url} name={name} onClose={() => setLightbox(false)} /> : null}
    </>
  );
}
