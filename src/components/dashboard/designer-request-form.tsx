"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { Dialog } from "@/components/dialog";
import { Button, Field, FormError, Input, Select, Textarea } from "@/components/ui";
import { send, uploadFile } from "@/lib/client-api";
import { useToast } from "@/components/toast";

export type DesignerRequestClientOption = { id: string; company: string };

/**
 * Dipakai designer untuk membuat request atas nama client — mis. client minta lewat
 * WhatsApp/telepon dan belum sempat bikin request sendiri lewat portalnya.
 */
export function DesignerRequestForm({
  clients,
  defaultClientId,
}: {
  clients: DesignerRequestClientOption[];
  /** Kalau dipakai di halaman detail satu client, langsung pilih client itu & sembunyikan dropdown. */
  defaultClientId?: string;
}) {
  const router = useRouter();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const brief = data.get("brief");
    const reference = data.get("reference");

    try {
      const briefUrl = brief instanceof File && brief.size > 0 ? await uploadFile(brief) : "";
      const referenceUrl =
        reference instanceof File && reference.size > 0 ? await uploadFile(reference) : "";

      await send("/api/requests", "POST", {
        clientId: defaultClientId ?? data.get("clientId"),
        title: data.get("title"),
        description: data.get("description"),
        quotaCost: data.get("quotaCost"),
        briefUrl,
        referenceUrl,
      });

      push({ kind: "success", title: "Request dibuat", description: "Langsung masuk ke kolom Pending." });
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membuat request";
      setError(message);
      push({ kind: "error", title: "Gagal membuat request", description: message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button variant="primary" icon={<PlusCircle className="h-4 w-4" />} onClick={() => setOpen(true)}>
        Request baru
      </Button>

      <Dialog open={open} title="Buat request untuk client" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          {defaultClientId ? null : (
            <Field label="Client" hint="Pilih client yang mengajukan desain ini.">
              <Select name="clientId" required defaultValue="">
                <option value="" disabled>
                  Pilih client
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <Field label="Judul desain">
            <Input name="title" required placeholder="Banner promo akhir tahun" />
          </Field>

          <Field label="Deskripsi" hint="Jelaskan ukuran, isi teks, dan tujuan pemakaian desain.">
            <Textarea name="description" placeholder="Ukuran 1080x1350, untuk feed Instagram…" />
          </Field>

          <Field label="Jumlah kuota" hint="Kelipatan 0.5 — isi lebih dari 1 kalau request ini lebih berat, mis. 1.5 atau 2.">
            <Input name="quotaCost" type="number" min={0.5} step={0.5} defaultValue={1} required />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brief" hint="Opsional. PDF, DOC, atau gambar. Maks 5 MB.">
              <Input
                name="brief"
                type="file"
                className="py-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-wash file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink"
              />
            </Field>
            <Field label="Referensi" hint="Opsional.">
              <Input
                name="reference"
                type="file"
                className="py-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-wash file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink"
              />
            </Field>
          </div>

          <FormError message={error} />

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Menyimpan…" : "Buat request"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
