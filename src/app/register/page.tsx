import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderKanban, Gauge, Users } from "lucide-react";
import { getSession } from "@/lib/auth";
import { RegisterForm } from "@/components/register-form";
import { AuthFeature, AuthHero, AuthShell } from "@/components/auth-shell";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect(session.role === "DESIGNER" ? "/dashboard" : "/portal");

  return (
    <AuthShell
      hero={
        <AuthHero
          headline="Bangun workspace studio desain Anda sendiri."
          description="Daftar sebagai designer, undang client Anda satu per satu, dan kelola kuota serta request desain dalam satu dashboard."
        >
          <AuthFeature icon={Users} title="Undang client" desc="Client aktivasi akun sendiri lewat link undangan." />
          <AuthFeature icon={FolderKanban} title="Kelola request" desc="Pantau semua request desain dalam papan Kanban." />
          <AuthFeature icon={Gauge} title="Kuota per client" desc="Atur paket dan kuota untuk tiap client secara terpisah." />
        </AuthHero>
      }
    >
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-ink">Daftar sebagai Designer</h1>
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
    </AuthShell>
  );
}
