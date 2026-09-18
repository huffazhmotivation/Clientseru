import { redirect } from "next/navigation";
import Link from "next/link";
import { Gauge, Layers, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { AuthFeature, AuthHero, AuthShell } from "@/components/auth-shell";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "DESIGNER" ? "/dashboard" : "/portal");

  return (
    <AuthShell
      hero={
        <AuthHero
          headline="Kolaborasi desain yang rapi, transparan, dan tanpa drama."
          description="Satu tempat untuk client mengirim request desain dan memantau kuota, sementara designer mengelola semuanya seperti command center."
        >
          <AuthFeature icon={Gauge} title="Kuota real-time" desc="Progress terpakai vs tersisa selalu terlihat jelas." />
          <AuthFeature icon={Layers} title="Alur kerja Kanban" desc="Pending → Working → Revision → Done." />
          <AuthFeature icon={ShieldCheck} title="Akses terpisah" desc="Portal client dan dashboard designer terpisah aman." />
        </AuthHero>
      }
    >
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-ink">Selamat datang kembali</h1>
      <p className="mt-1.5 mb-8 text-sm text-muted">Masuk untuk melihat kuota dan request desain Anda.</p>

      <LoginForm />

      <p className="mt-8 text-center text-xs text-muted">
        Login sebagai client? Hubungi designer yang menangani akun Anda untuk mendapat link undangan.
      </p>
      <p className="mt-2 text-center text-xs text-muted">
        Designer baru?{" "}
        <Link href="/register" className="font-medium text-brand-600 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </AuthShell>
  );
}
