import { redirect } from "next/navigation";
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

  // Kalau designer membuka link invite, arahkan ke dashboard
  if (session?.role === "DESIGNER") {
    redirect("/dashboard");
  }

  const invitation = await prisma.clientInvitation.findUnique({
    where: {
      token,
    },
    include: {
      client: true,
    },
  });

  if (!invitation) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-xl font-semibold">
            Undangan tidak ditemukan
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Link undangan sudah tidak valid.
          </p>
        </div>
      </main>
    );
  }

  if (invitation.usedAt) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-xl font-semibold">
            Undangan sudah digunakan
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <InviteActivateForm token={token} />
    </main>
  );
}