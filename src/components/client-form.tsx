"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "./dialog";
import { Button, Field, FormError, Input, Select, Textarea } from "./ui";
import { send } from "@/lib/client-api";

export type PackageOption = { id: string; name: string; quota: number };

export type ClientFormValue = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  note: string | null;
  packageId: string | null;
  totalQuota: number;
};

export function ClientForm({
  packages,
  client,
  trigger = "Tambah client",
}: {
  packages: PackageOption[];
  client?: ClientFormValue;
  trigger?: string;
}) {
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
      if (client) {
        await send(`/api/clients/${client.id}`, "PATCH", data);
      } else {
        await send("/api/clients", "POST", data);
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button variant={client ? "secondary" : "primary"} onClick={() => setOpen(true)}>
        {trigger}
      </Button>

      <Dialog open={open} title={client ? "Edit client" : "Client baru"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Perusahaan">
              <Input name="company" defaultValue={client?.company} required placeholder="PT ABC" />
            </Field>
            <Field label="Nama PIC">
              <Input name="name" defaultValue={client?.name} required placeholder="Budi Santoso" />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" defaultValue={client?.email} required placeholder="pic@abc.co.id" />
            </Field>
            <Field label="Telepon">
              <Input name="phone" defaultValue={client?.phone ?? ""} placeholder="08xxxxxxxxxx" />
            </Field>
            <Field label="Paket">
              <Select name="packageId" defaultValue={client?.packageId ?? ""}>
                <option value="">Tanpa paket</option>
                {packages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.quota} desain
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Total kuota" hint={client ? "Ubah lewat menu tambah kuota agar tercatat di riwayat" : undefined}>
              <Input
                name="totalQuota"
                type="number"
                min={0}
                defaultValue={client?.totalQuota ?? 0}
                disabled={Boolean(client)}
              />
            </Field>
          </div>

          <Field label="Catatan">
            <Textarea name="note" defaultValue={client?.note ?? ""} placeholder="Opsional" />
          </Field>

          {!client ? (
            <Field label="Password login client" hint="Client memakai email di atas untuk masuk. Minimal 6 karakter.">
              <Input name="password" type="text" minLength={6} required placeholder="misal: abc123456" />
            </Field>
          ) : null}

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
