"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "./dialog";
import { Button, Field, FormError, Input, Select } from "./ui";
import { send } from "@/lib/client-api";

export function QuotaForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await send(`/api/clients/${clientId}/quota`, "POST", data);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah kuota");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Tambah kuota
      </Button>

      <Dialog open={open} title="Tambah atau koreksi kuota" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Jenis">
            <Select name="type" defaultValue="TOPUP">
              <option value="TOPUP">Penambahan kuota</option>
              <option value="ADJUST">Koreksi</option>
            </Select>
          </Field>
          <Field label="Jumlah" hint="Isi angka negatif untuk mengurangi kuota, misal -5">
            <Input name="amount" type="number" defaultValue={10} required />
          </Field>
          <Field label="Alasan">
            <Input name="description" required placeholder="Tambahan project" />
          </Field>

          <FormError message={error} />

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
