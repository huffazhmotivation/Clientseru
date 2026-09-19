"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Loader2, Plus } from "lucide-react";
import { Dialog } from "@/components/dialog";
import { Button, FormError, Input, Select, StatusTag } from "@/components/ui";
import { AttachmentCard } from "@/components/file-preview";
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
  onStatusChange,
}: {
  open: boolean;
  onClose: () => void;
  request: RequestDetailData | null;
  role: "DESIGNER" | "CLIENT";
  /** e.g. "Client" on admin view, "Designer" on client view */
  personLabel?: string;
  personName?: string;
  /** Kalau diisi, perubahan status diserahkan ke parent (mis. papan Kanban) supaya kartunya
   *  langsung pindah kolom tanpa menunggu server. */
  onStatusChange?: (status: string) => void;
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

  // Daftar hasil kerja disimpan lokal supaya tambah/hapus langsung tampil (optimistic),
  // tidak menunggu POST/DELETE + render ulang seluruh halaman di server.
  const [deliverables, setDeliverables] = useState<DeliverableData[]>(request?.deliverables ?? []);
  const pendingOps = useRef(0);
  const serverDeliverables = request?.deliverables;
  const serverStatus = request?.status;
  useEffect(() => {
    if (serverDeliverables && pendingOps.current === 0) setDeliverables(serverDeliverables);
  }, [serverDeliverables]);
  useEffect(() => {
    if (serverStatus) setStatus(serverStatus);
  }, [serverStatus]);

  if (!request) return null;

  async function updateStatus(next: string) {
    if (!request) return;
    if (onStatusChange) {
      setStatus(next);
      onStatusChange(next);
      return;
    }
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

    const url = linkUrl.trim();
    const name = linkName.trim() || url;
    const tempId = `tmp-${Date.now()}`;
    setDeliverables((prev) => [
      { id: tempId, type: "LINK", url, name, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setLinkName("");
    setLinkUrl("");

    pendingOps.current += 1;
    try {
      const created = await send<DeliverableData>(`/api/requests/${request.id}/deliverables`, "POST", {
        type: "LINK",
        url,
        name,
      });
      setDeliverables((prev) => prev.map((item) => (item.id === tempId ? created : item)));
      push({ kind: "success", title: "Link hasil ditambahkan" });
    } catch (err) {
      setDeliverables((prev) => prev.filter((item) => item.id !== tempId));
      setLinkName(linkName);
      setLinkUrl(linkUrl);
      const message = err instanceof Error ? err.message : "Gagal menambahkan link";
      setError(message);
      push({ kind: "error", title: "Gagal menambahkan link", description: message });
    } finally {
      pendingOps.current -= 1;
      router.refresh();
    }
  }

  async function addFiles(files: FileList | null) {
    if (!request || !files || files.length === 0) return;
    setError(null);
    setUploading(true);
    pendingOps.current += 1;
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        const created = await send<DeliverableData>(`/api/requests/${request.id}/deliverables`, "POST", {
          type: "FILE",
          url,
          name: file.name,
        });
        setDeliverables((prev) => [created, ...prev]);
      }
      push({
        kind: "success",
        title: files.length > 1 ? "File hasil ditambahkan" : "File hasil ditambahkan",
        description: files.length > 1 ? `${files.length} file berhasil diupload.` : undefined,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal mengupload file";
      setError(message);
      push({ kind: "error", title: "Gagal mengupload file", description: message });
    } finally {
      pendingOps.current -= 1;
      router.refresh();
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeDeliverable(id: string) {
    if (!request) return;
    const snapshot = deliverables;
    setDeletingId(id);
    setDeliverables((prev) => prev.filter((item) => item.id !== id));
    pendingOps.current += 1;
    try {
      await send(`/api/requests/${request.id}/deliverables/${id}`, "DELETE");
      push({ kind: "success", title: "Lampiran hasil dihapus" });
    } catch (err) {
      setDeliverables(snapshot);
      push({
        kind: "error",
        title: "Gagal menghapus lampiran",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      pendingOps.current -= 1;
      setDeletingId(null);
      router.refresh();
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
              <Link href={`/clients/${request.client.id}`} className="font-medium text-brand-400 hover:underline">
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
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {request.briefUrl ? (
                <AttachmentCard name="Berkas brief" url={request.briefUrl} meta="Diunggah client" size="sm" />
              ) : null}
              {request.referenceUrl ? (
                <AttachmentCard name="Referensi desain" url={request.referenceUrl} meta="Diunggah client" size="sm" />
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
            Hasil kerja {deliverables.length > 0 ? `(${deliverables.length})` : ""}
          </p>

          {deliverables.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line py-6 text-center text-sm text-subtle">
              {isDesigner ? "Belum ada file atau link hasil yang diunggah." : "Designer belum mengunggah hasil kerja."}
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {deliverables.map((item) => (
                <AttachmentCard
                  key={item.id}
                  name={item.name}
                  url={item.url}
                  type={item.type}
                  meta={formatDateTime(item.createdAt)}
                  onRemove={isDesigner && !item.id.startsWith("tmp-") ? () => removeDeliverable(item.id) : undefined}
                  removing={deletingId === item.id}
                />
              ))}
            </div>
          )}

          {/* ---------- Admin: add deliverable ---------- */}
          {isDesigner ? (
            <div className="glass-faint mt-4 rounded-lg p-3">
              <div className="mb-2.5 flex gap-1 rounded-lg bg-edge/10 p-1 shadow-xs">
                <button
                  onClick={() => setMode("file")}
                  className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    mode === "file" ? "bg-brand-600 text-white" : "text-muted hover:bg-edge/10"
                  }`}
                >
                  Upload file
                </button>
                <button
                  onClick={() => setMode("link")}
                  className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    mode === "link" ? "bg-brand-600 text-white" : "text-muted hover:bg-edge/10"
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
                    className="w-full text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-canvas file:shadow-xs hover:file:opacity-90"
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
