"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "./dialog";
import { Button, Field, FormError, Input } from "./ui";
import { send } from "@/lib/client-api";

export function PackageForm() {
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
      await send("/api/packages", "POST", data);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan paket");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Tambah paket
      </Button>
      <Dialog open={open} title="Paket baru" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Nama paket">
            <Input name="name" required placeholder="Monthly Design 30" />
          </Field>
          <Field label="Jumlah desain per bulan">
            <Input name="quota" type="number" min={1} defaultValue={30} required />
          </Field>
          <Field label="Harga" hint="Opsional, dalam rupiah.">
            <Input name="price" type="number" min={0} defaultValue={0} />
          </Field>
          <FormError message={error} />
          <div className="flex justify-end gap-2">
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
