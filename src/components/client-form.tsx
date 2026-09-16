"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, UserPlus } from "lucide-react";
import { Dialog } from "./dialog";
import { Button, Field, FormError, Input, Select, Textarea } from "./ui";
import { send } from "@/lib/client-api";
import { useToast } from "./toast";

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
  trigger,
}: {
  packages: PackageOption[];
  client?: ClientFormValue;
  trigger?: string;
}) {
  const router = useRouter();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [invite, setInvite] = useState<{ email: string; password: string; company: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function reset() {
    setOpen(false);
    setInvite(null);
    setCopied(false);
    router.refresh();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (client) {
        await send(`/api/clients/${client.id}`, "PATCH", data);
        push({ kind: "success", title: "Client diperbarui", description: String(data.company) });
        setOpen(false);
        router.refresh();
      } else {
        await send("/api/clients", "POST", data);
        // Show a shareable "invitation" card instead of closing immediately.
        setInvite({ email: String(data.email), password: String(data.password), company: String(data.company) });
        push({ kind: "success", title: "Client berhasil ditambahkan" });
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan data";
      setError(message);
      push({ kind: "error", title: "Gagal menyimpan client", description: message });
    } finally {
      setSaving(false);
    }
  }

  async function copyInvite() {
    if (!invite) return;
    const text = `Halo ${invite.company}, akses portal desain Anda:\nEmail: ${invite.email}\nPassword: ${invite.password}\nLogin di: ${typeof window !== "undefined" ? window.location.origin : ""}/login`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <>
      <Button
        variant={client ? "secondary" : "primary"}
        icon={client ? undefined : <UserPlus className="h-4 w-4" />}
        onClick={() => setOpen(true)}
      >
        {trigger ?? (client ? "Edit" : "Tambah Client")}
      </Button>

      <Dialog open={open} title={invite ? "Client ditambahkan" : client ? "Edit client" : "Undang client baru"} onClose={reset}>
        {invite ? (
          <div className="space-y-4 animate-scale-in">
            <p className="text-sm text-muted">
              <span className="font-medium text-ink">{invite.company}</span> sudah bisa masuk ke portal desain. Bagikan
              kredensial berikut ke PIC mereka.
            </p>
            <div className="space-y-2 rounded-lg border border-line bg-wash/70 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Email</span>
                <span className="font-medium text-ink">{invite.email}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted">Password</span>
                <span className="font-mono font-medium text-ink">{invite.password}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line-soft pt-2">
                <span className="text-muted">Link login</span>
                <span className="font-medium text-brand-600">/login</span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={reset}>Selesai</Button>
              <Button variant="primary" onClick={copyInvite} icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>
                {copied ? "Tersalin!" : "Salin kredensial"}
              </Button>
            </div>
          </div>
        ) : (
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
              <Button type="button" onClick={reset}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Menyimpan…" : client ? "Simpan" : "Undang client"}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}
