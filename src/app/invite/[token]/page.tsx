import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InviteActivateForm } from "@/components/invite-activate-form";


export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const session = await getSession();

  // Jika designer membuka link invite,
  // arahkan kembali ke dashboard designer.
  if (session?.role === "DESIGNER") {
    redirect("/dashboard");
  }

  const invitation = await prisma.clientInvitation.findUnique({
    where: {
      token,
    },
    include: {
      client: {
        include: {
          designer: true,
        },
      },
    },
  });


  // Token tidak ditemukan
  if (!invitation) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">
            Undangan tidak ditemukan
          </h1>

          <p className="text-white/60">
            Link undangan mungkin sudah tidak berlaku.
          </p>

          <Link
            href="/"
            className="inline-block rounded-xl bg-white px-5 py-3 text-black"
          >
            Kembali
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen grid place-items-center bg-black text-white px-5">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

        <div className="flex items-center gap-3 mb-8">

          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h1 className="font-bold text-xl">
              ClientSeru
            </h1>

            <p className="text-sm text-white/50">
              Workspace invitation
            </p>
          </div>

        </div>


        <div className="space-y-3 mb-8">

          <h2 className="text-2xl font-semibold">
            Buat password Anda
          </h2>

          <p className="text-sm text-white/60">
            Anda mendapatkan undangan untuk bergabung
            sebagai client.
          </p>

        </div>


        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">

          <div className="flex items-center gap-2 text-sm">

            <ShieldCheck className="h-4 w-4" />

            <span>
              Akun akan terhubung dengan designer:
            </span>

          </div>


          <p className="mt-2 font-semibold">
            {invitation.client.designer?.name ??
              invitation.client.designer?.email}
          </p>

        </div>


        <InviteActivateForm
          token={token}
          email={invitation.client.email}
        />

      </div>

    </main>
  );
}