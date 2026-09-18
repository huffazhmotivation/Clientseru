import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InviteActivateForm } from "@/components/invite-activate-form";
import { AuthHero, AuthShell } from "@/components/auth-shell";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const session = await getSession();
  if (session) redirect(session.role === "DESIGNER" ? "/dashboard" : "/portal");

  const invitation = await prisma.clientInvitation.findUnique({
    where: { token },
    include: { client: { include: { designer: true } } },
  });

  return (
    <AuthShell
      hero={
        <AuthHero
          headline="Anda diundang ke portal desain."
          description="Buat password Anda sendiri untuk mengaktifkan akun. Designer tidak pernah tahu password Anda."
        />
      }
    >
      {!invitation ? (
        <InvalidState reason="Link undangan ini tidak ditemukan. Pastikan Anda membuka link yang benar." />
      ) : invitation.usedAt ? (
        <InvalidState reason="Link undangan ini sudah pernah dipakai untuk mengaktifkan akun." showLoginLink />
      ) : (
        <>
          <div className="glass-faint mb-6 flex items-start gap-3 rounded-lg p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <div className="text-sm">
              <p className="font-medium text-ink">{invitation.client.company}</p>
              <p className="mt-0.5 text-muted">
                Diundang oleh <span className="font-medium text-ink">{invitation.client.designer.name}</span>
              </p>
              <p className="mt-0.5 text-muted">Email login: {invitation.email}</p>
            </div>
          </div>

          <h1 className="font-sans text-3xl font-semibold tracking-tight text-ink">Buat password Anda</h1>
          <p className="mt-1.5 mb-8 text-sm text-muted">
            Setelah ini Anda bisa langsung masuk ke portal desain untuk mengirim request dan memantau kuota.
          </p>

          <InviteActivateForm token={token} />
        </>
      )}
    </AuthShell>
  );
}

function InvalidState({ reason, showLoginLink }: { reason: string; showLoginLink?: boolean }) {
  return (
    <div>
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-ink">Link tidak valid</h1>
      <p className="mt-1.5 mb-6 text-sm text-muted">{reason}</p>
      {showLoginLink ? (
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-brand-gradient px-4 py-2.5 text-sm font-medium text-white shadow-glow"
        >
          Ke halaman login
        </Link>
      ) : (
        <p className="text-xs text-subtle">Hubungi designer Anda untuk meminta link undangan baru.</p>
      )}
    </div>
  );
}
