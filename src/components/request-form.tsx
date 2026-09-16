"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, FormError, Input, Textarea } from "./ui";
import { send, uploadFile } from "@/lib/client-api";

/** Dipakai client untuk mengajukan desain baru. */
export function RequestForm({ remaining }: { remaining: number }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const brief = form.get("brief");
    const reference = form.get("reference");

    try {
      const briefUrl = brief instanceof File && brief.size > 0 ? await uploadFile(brief) : "";
      const referenceUrl =
        reference instanceof File && reference.size > 0 ? await uploadFile(reference) : "";

      await send("/api/requests", "POST", {
        title: form.get("title"),
        description: form.get("description"),
        briefUrl,
        referenceUrl,
      });

      router.push("/portal/requests");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim request");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <Field label="Judul desain">
        <Input name="title" required placeholder="Banner promo akhir tahun" />
      </Field>

      <Field label="Deskripsi" hint="Jelaskan ukuran, isi teks, dan tujuan pemakaian desain.">
        <Textarea name="description" placeholder="Ukuran 1080x1350, untuk feed Instagram…" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brief" hint="PDF, DOC, atau gambar. Maksimal 5 MB.">
          <Input name="brief" type="file" className="py-1" />
        </Field>
        <Field label="Referensi" hint="Opsional.">
          <Input name="reference" type="file" className="py-1" />
        </Field>
      </div>

      <p className="text-sm text-muted">
        Satu request memakai 1 kuota dan dipotong saat desain selesai. Sisa kuota Anda sekarang{" "}
        <span className="font-medium tabular-nums text-ink">{remaining}</span>.
      </p>

      <FormError message={error} />

      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={saving || remaining <= 0}>
          {saving ? "Mengirim…" : "Kirim request"}
        </Button>
        <Button type="button" onClick={() => router.back()}>
          Batal
        </Button>
      </div>

      {remaining <= 0 ? (
        <p className="text-sm text-red-600">Kuota Anda habis. Hubungi designer untuk menambah kuota.</p>
      ) : null}
    </form>
  );
}
