"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button, Field, FormError, Input } from "./ui";
import { send } from "@/lib/client-api";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await send<{ redirectTo: string }>("/api/auth/register", "POST", data);
      router.replace(result.redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Nama">
        <Input name="name" type="text" required autoComplete="name" placeholder="Nama Anda" />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" required autoComplete="email" placeholder="nama@studio.com" />
      </Field>
      <Field label="Password">
        <Input name="password" type="password" required minLength={6} autoComplete="new-password" />
      </Field>
      <FormError message={error} />
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading}
        icon={<UserPlus className="h-4 w-4" />}
      >
        {loading ? "Memproses…" : "Daftar sebagai Designer"}
      </Button>
    </form>
  );
}
