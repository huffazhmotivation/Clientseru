"use client";

import { useState } from "react";
import { Check, Copy, MailWarning, RefreshCw } from "lucide-react";
import { Button, Card } from "./ui";
import { send } from "@/lib/client-api";
import { useToast } from "./toast";

export function InvitationStatusCard({ clientId, inviteToken }: { clientId: string; inviteToken?: string }) {
  const { push } = useToast();
  const [token, setToken] = useState<string | undefined>(inviteToken);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const link = token && typeof window !== "undefined" ? `${window.location.origin}/invite/${token}` : null;

  async function regenerate() {
    setLoading(true);
    try {
      const result = await send<{ inviteLink: string }>(`/api/clients/${clientId}/invite`, "POST");
      const newToken = result.inviteLink.split("/invite/")[1];
      setToken(newToken);
      push({ kind: "success", title: "Link undangan baru dibuat" });
    } catch (err) {
      push({ kind: "error", title: "Gagal membuat link undangan", description: err instanceof Error ? err.message : undefined });
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <Card className="flex flex-col gap-3 border-accentAmber-500/30 bg-accentAmber-500/10 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-accentAmber-500" />
        <div>
          <p className="text-sm font-medium text-ink">Client belum mengaktifkan akun</p>
          <p className="mt-0.5 text-xs text-muted">
            Bagikan link undangan supaya client bisa membuat password sendiri dan login.
          </p>
          {link ? <p className="mt-1.5 break-all font-mono text-xs text-brand-400">{link}</p> : null}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        {link ? (
          <Button onClick={copyLink} icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>
            {copied ? "Tersalin!" : "Salin link"}
          </Button>
        ) : null}
        <Button onClick={regenerate} disabled={loading} icon={<RefreshCw className="h-4 w-4" />}>
          {loading ? "Memproses…" : link ? "Buat ulang link" : "Buat link undangan"}
        </Button>
      </div>
    </Card>
  );
}
