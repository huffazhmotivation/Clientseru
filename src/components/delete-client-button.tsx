"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "./ui";
import { Dialog } from "./dialog";
import { send } from "@/lib/client-api";
import { useToast } from "./toast";

export function DeleteClientButton({ clientId, company }: { clientId: string; company: string }) {
  const router = useRouter();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    setBusy(true);
    try {
      await send(`/api/clients/${clientId}`, "DELETE");
      push({ kind: "success", title: "Client dihapus", description: company });
      router.replace("/clients");
      router.refresh();
    } catch (error) {
      push({
        kind: "error",
        title: "Gagal menghapus client",
        description: error instanceof Error ? error.message : undefined,
      });
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => setOpen(true)}>
        Hapus client
      </Button>

      <Dialog open={open} title="Hapus client" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-accentRose-100 bg-accentRose-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accentRose-600" />
            <p className="text-sm text-ink">
              Hapus <span className="font-semibold">{company}</span>? Seluruh request dan riwayat kuota client ini akan
              ikut terhapus permanen. Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)} disabled={busy}>
              Batal
            </Button>
            <Button variant="danger" onClick={onDelete} disabled={busy}>
              {busy ? "Menghapus…" : "Ya, hapus client"}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
