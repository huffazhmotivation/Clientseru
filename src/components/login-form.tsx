"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, FormError, Input } from "./ui";
import { send } from "@/lib/client-api";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await send<{ redirectTo: string }>("/api/auth/login", "POST", data);
      router.replace(result.redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email">
        <Input name="email" type="email" required autoComplete="email" placeholder="nama@studio.com" />
      </Field>
      <Field label="Password">
        <Input name="password" type="password" required autoComplete="current-password" />
      </Field>
      <FormError message={error} />
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "Memproses…" : "Masuk"}
      </Button>
    </form>
  );
}
