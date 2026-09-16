"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui";
import { send } from "@/lib/client-api";

export function DeleteClientButton({ clientId, company }: { clientId: string; company: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    const confirmed = window.confirm(
      `Hapus ${company}? Seluruh request dan riwayat kuota client ini ikut terhapus.`,
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      await send(`/api/clients/${clientId}`, "DELETE");
      router.replace("/clients");
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Gagal menghapus client");
      setBusy(false);
    }
  }

  return (
    <Button variant="danger" onClick={onDelete} disabled={busy}>
      {busy ? "Menghapus…" : "Hapus client"}
    </Button>
  );
}
