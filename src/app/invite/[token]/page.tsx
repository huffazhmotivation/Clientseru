import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InviteActivateForm } from "@/components/invite-activate-form";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const session = await getSession();
  if (session) redirect(session.role === "DESIGNER" ? "/dashboard" : "/portal");

  const invitation = await prisma.clientInvitation.findUnique({
    where: { token },
    include: { client: { include: { designer: true } } },
  });

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-gradient p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
            <Sparkles className="h-[18px] w-[18px]" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Kuota Desain</span>
        </div>

        <div className="relative max-w-sm">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">Anda diundang ke portal desain.</h2>
          <p className="mt-3 text-sm text-white/80">
            Buat password Anda sendiri untuk mengaktifkan akun. Designer tidak pernah tahu password Anda.
          </p>
        </div>

        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} Kuota Desain Studio</p>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-glow">
              <Sparkles className="h-[18px] w-[18px]" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink">Kuota Desain</span>
          </div>

          {!invitation ? (
            <InvalidState reason="Link undangan ini tidak ditemukan. Pastikan Anda membuka link yang benar." />
          ) : invitation.usedAt ? (
            <InvalidState
              reason="Link undangan ini sudah pernah dipakai untuk mengaktifkan akun."
              showLoginLink
            />
          ) : (
            <>
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-line bg-wash/60 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div className="text-sm">
                  <p className="font-medium text-ink">{invitation.client.company}</p>
                  <p className="mt-0.5 text-muted">
                    Diundang oleh <span className="font-medium text-ink">{invitation.client.designer.name}</span>
                  </p>
                  <p className="mt-0.5 text-muted">Email login: {invitation.email}</p>
                </div>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-ink">Buat password Anda</h1>
              <p className="mt-1.5 mb-8 text-sm text-muted">
                Setelah ini Anda bisa langsung masuk ke portal desain untuk mengirim request dan memantau kuota.
              </p>

              <InviteActivateForm token={token} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function InvalidState({ reason, showLoginLink }: { reason: string; showLoginLink?: boolean }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Link tidak valid</h1>
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
