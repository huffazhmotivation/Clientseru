"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button, Field, FormError, Input } from "./ui";
import { send } from "@/lib/client-api";
import { useToast } from "./toast";

export function ChangePasswordForm() {
  const { push } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      await send("/api/auth/password", "PATCH", data);
      push({ kind: "success", title: "Password berhasil diganti" });
      form.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal mengganti password";
      setError(message);
      push({ kind: "error", title: "Gagal mengganti password", description: message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Password lama">
        <Input name="currentPassword" type="password" required autoComplete="current-password" />
      </Field>
      <Field label="Password baru" hint="Minimal 6 karakter.">
        <Input name="newPassword" type="password" required minLength={6} autoComplete="new-password" />
      </Field>
      <Field label="Konfirmasi password baru">
        <Input name="confirmPassword" type="password" required minLength={6} autoComplete="new-password" />
      </Field>
      <FormError message={error} />
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={saving} icon={<KeyRound className="h-4 w-4" />}>
          {saving ? "Menyimpan…" : "Ganti password"}
        </Button>
      </div>
    </form>
  );
}
