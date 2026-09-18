"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Button, Field, FormError, Input } from "./ui";
import { send } from "@/lib/client-api";

export function InviteActivateForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await send<{ redirectTo: string }>(`/api/invite/${token}`, "POST", data);
      router.replace(result.redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aktivasi gagal");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Password baru" hint="Minimal 6 karakter">
        <Input name="password" type="password" required minLength={6} autoComplete="new-password" />
      </Field>
      <Field label="Konfirmasi password">
        <Input name="confirmPassword" type="password" required minLength={6} autoComplete="new-password" />
      </Field>
      <FormError message={error} />
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading}
        icon={<KeyRound className="h-4 w-4" />}
      >
        {loading ? "Memproses…" : "Aktifkan akun & masuk"}
      </Button>
    </form>
  );
}
