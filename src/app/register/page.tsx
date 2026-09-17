import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Users, FolderKanban, Gauge, type LucideIcon } from "lucide-react";
import { getSession } from "@/lib/auth";
import { RegisterForm } from "@/components/register-form";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect(session.role === "DESIGNER" ? "/dashboard" : "/portal");

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
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
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Bangun workspace studio desain Anda sendiri.
          </h2>
          <p className="mt-3 text-sm text-white/80">
            Daftar sebagai designer, undang client Anda satu per satu, dan kelola kuota serta request desain dalam
            satu dashboard.
          </p>

          <div className="mt-10 space-y-4">
            <Feature icon={Users} title="Undang client" desc="Client aktivasi akun sendiri lewat link undangan." />
            <Feature icon={FolderKanban} title="Kelola request" desc="Pantau semua request desain dalam papan Kanban." />
            <Feature icon={Gauge} title="Kuota per client" desc="Atur paket dan kuota untuk tiap client secara terpisah." />
          </div>
        </div>

        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} Kuota Desain Studio</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-glow">
              <Sparkles className="h-[18px] w-[18px]" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink">Kuota Desain</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-ink">Daftar sebagai Designer</h1>
          <p className="mt-1.5 mb-8 text-sm text-muted">
            Khusus untuk designer/studio. Client tidak mendaftar di sini — client diundang oleh designer.
          </p>

          <RegisterForm />

          <p className="mt-8 text-center text-xs text-muted">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-brand-600 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-white/70">{desc}</p>
      </div>
    </div>
  );
}
