import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "ADMIN" ? "/dashboard" : "/portal");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="text-xl font-semibold tracking-tight text-ink">Kuota Desain</h1>
      <p className="mt-1 mb-8 text-sm text-muted">Masuk untuk melihat kuota dan request desain.</p>
      <LoginForm />
      <p className="mt-8 text-xs text-muted">
        Belum punya akses? Hubungi designer yang menangani akun Anda.
      </p>
    </main>
  );
}
