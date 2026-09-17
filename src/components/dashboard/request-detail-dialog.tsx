"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Download,
  ExternalLink,
  File as FileIcon,
  Link2,
  Loader2,
  Paperclip,
  Plus,
  Trash2,
} from "lucide-react";
import { Dialog } from "@/components/dialog";
import { Button, FormError, Input, Select, StatusTag } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { send, uploadFile } from "@/lib/client-api";
import { useToast } from "@/components/toast";

export type DeliverableData = {
  id: string;
  type: "FILE" | "LINK";
  url: string;
  name: string;
  createdAt: string | Date;
};

export type RequestDetailData = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  quotaCost: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
  doneAt?: string | Date | null;
  briefUrl: string | null;
  referenceUrl: string | null;
  client?: { id: string; company: string };
  deliverables: DeliverableData[];
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "WORKING", label: "Dikerjakan" },
  { value: "REVISION", label: "Revisi" },
  { value: "DONE", label: "Selesai" },
  { value: "CANCELLED", label: "Dibatalkan" },
];

export function RequestDetailDialog({
  open,
  onClose,
  request,
  role,
  personLabel,
  personName,
}: {
  open: boolean;
  onClose: () => void;
  request: RequestDetailData | null;
  role: "DESIGNER" | "CLIENT";
  /** e.g. "Client" on admin view, "Designer" on client view */
  personLabel?: string;
  personName?: string;
}) {
  const router = useRouter();
  const { push } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState(request?.status ?? "PENDING");
  const [savingStatus, setSavingStatus] = useState(false);
  const [mode, setMode] = useState<"file" | "link">("file");
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!request) return null;

  async function updateStatus(next: string) {
    if (!request) return;
    setSavingStatus(true);
    setStatus(next);
    try {
      await send(`/api/requests/${request.id}`, "PATCH", { status: next });
      push({ kind: "success", title: "Status diperbarui" });
      router.refresh();
    } catch (err) {
      setStatus(request.status);
      push({
        kind: "error",
        title: "Gagal memperbarui status",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSavingStatus(false);
    }
  }

  async function addLink() {
    if (!request) return;
    if (!linkUrl.trim()) {
      setError("Link wajib diisi");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      await send(`/api/requests/${request.id}/deliverables`, "POST", {
        type: "LINK",
        url: linkUrl.trim(),
        name: linkName.trim() || linkUrl.trim(),
      });
      setLinkName("");
      setLinkUrl("");
      push({ kind: "success", title: "Link hasil ditambahkan" });
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menambahkan link";
      setError(message);
      push({ kind: "error", title: "Gagal menambahkan link", description: message });
    } finally {
      setUploading(false);
    }
  }

  async function addFiles(files: FileList | null) {
    if (!request || !files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        await send(`/api/requests/${request.id}/deliverables`, "POST", {
          type: "FILE",
          url,
          name: file.name,
        });
      }
      push({
        kind: "success",
        title: files.length > 1 ? "File hasil ditambahkan" : "File hasil ditambahkan",
        description: files.length > 1 ? `${files.length} file berhasil diupload.` : undefined,
      });
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal mengupload file";
      setError(message);
      push({ kind: "error", title: "Gagal mengupload file", description: message });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeDeliverable(id: string) {
    if (!request) return;
    setDeletingId(id);
    try {
      await send(`/api/requests/${request.id}/deliverables/${id}`, "DELETE");
      push({ kind: "success", title: "Lampiran hasil dihapus" });
      router.refresh();
    } catch (err) {
      push({
        kind: "error",
        title: "Gagal menghapus lampiran",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setDeletingId(null);
    }
  }

  const isDesigner = role === "DESIGNER";

  return (
    <Dialog open={open} onClose={onClose} title="Detail Request">
      <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-0.5">
        {/* ---------- Header info ---------- */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug text-ink">{request.title}</h3>
            <StatusTag status={request.status} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-subtle">
            {request.client ? (
              <Link href={`/clients/${request.client.id}`} className="font-medium text-brand-600 hover:underline">
                {request.client.company}
              </Link>
            ) : personName ? (
              <span>
                {personLabel ? `${personLabel}: ` : ""}
                {personName}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDateTime(request.createdAt)}
            </span>
            <span className="font-medium text-ink">{request.quotaCost} kuota</span>
          </div>
        </div>

        {/* ---------- Brief ---------- */}
        <section>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-subtle">Brief</p>
          {request.description ? (
            <p className="whitespace-pre-wrap rounded-lg border border-line-soft bg-wash/60 p-3 text-sm text-ink">
              {request.description}
            </p>
          ) : (
            <p className="text-sm text-subtle">Tidak ada deskripsi tambahan.</p>
          )}

          {(request.briefUrl || request.referenceUrl) ? (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {request.briefUrl ? (
                <a
                  href={request.briefUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink shadow-xs hover:border-subtle hover:bg-wash"
                >
                  <Paperclip className="h-3.5 w-3.5" /> Berkas brief
                </a>
              ) : null}
              {request.referenceUrl ? (
                <a
                  href={request.referenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink shadow-xs hover:border-subtle hover:bg-wash"
                >
                  <Paperclip className="h-3.5 w-3.5" /> Referensi
                </a>
              ) : null}
            </div>
          ) : null}
        </section>

        {/* ---------- Status (admin only) ---------- */}
        {isDesigner ? (
          <section>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-subtle">Status pengerjaan</p>
            <Select
              value={status}
              disabled={savingStatus}
              onChange={(event) => updateStatus(event.target.value)}
              className="max-w-[220px]"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </section>
        ) : null}

        {/* ---------- Deliverables ---------- */}
        <section>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-subtle">
            Hasil kerja {request.deliverables.length > 0 ? `(${request.deliverables.length})` : ""}
          </p>

          {request.deliverables.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line py-6 text-center text-sm text-subtle">
              {isDesigner ? "Belum ada file atau link hasil yang diunggah." : "Designer belum mengunggah hasil kerja."}
            </p>
          ) : (
            <ul className="space-y-2">
              {request.deliverables.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-line bg-white p-2.5 shadow-xs"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-wash text-subtle">
                    {item.type === "LINK" ? <Link2 className="h-4 w-4" /> : <FileIcon className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-[11px] text-subtle">{formatDateTime(item.createdAt)}</p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    download={item.type === "FILE" ? item.name : undefined}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50"
                  >
                    {item.type === "LINK" ? (
                      <>
                        <ExternalLink className="h-3.5 w-3.5" /> Buka
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" /> Unduh
                      </>
                    )}
                  </a>
                  {isDesigner ? (
                    <button
                      onClick={() => removeDeliverable(item.id)}
                      disabled={deletingId === item.id}
                      className="shrink-0 rounded-md p-1.5 text-subtle transition-colors hover:bg-accentRose-50 hover:text-accentRose-600 disabled:opacity-50"
                      aria-label="Hapus lampiran"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          {/* ---------- Admin: add deliverable ---------- */}
          {isDesigner ? (
            <div className="mt-4 rounded-lg border border-line-soft bg-wash/50 p-3">
              <div className="mb-2.5 flex gap-1 rounded-lg bg-white p-1 shadow-xs">
                <button
                  onClick={() => setMode("file")}
                  className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    mode === "file" ? "bg-ink text-white" : "text-muted hover:bg-wash"
                  }`}
                >
                  Upload file
                </button>
                <button
                  onClick={() => setMode("link")}
                  className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    mode === "link" ? "bg-ink text-white" : "text-muted hover:bg-wash"
                  }`}
                >
                  Tambah link
                </button>
              </div>

              {mode === "file" ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    disabled={uploading}
                    onChange={(event) => addFiles(event.target.files)}
                    className="w-full text-xs text-muted file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink file:shadow-xs"
                  />
                  <p className="mt-1.5 text-[11px] text-subtle">
                    Bisa pilih beberapa file sekaligus. Maksimal 5 MB per file.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Nama tautan, mis. Folder Google Drive"
                    value={linkName}
                    onChange={(event) => setLinkName(event.target.value)}
                  />
                  <Input
                    placeholder="https://drive.google.com/..."
                    value={linkUrl}
                    onChange={(event) => setLinkUrl(event.target.value)}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={addLink}
                    disabled={uploading}
                    icon={<Plus className="h-3.5 w-3.5" />}
                  >
                    Tambahkan link
                  </Button>
                </div>
              )}

              {uploading ? (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-subtle">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengunggah…
                </p>
              ) : null}
              <div className="mt-2">
                <FormError message={error} />
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </Dialog>
  );
}
