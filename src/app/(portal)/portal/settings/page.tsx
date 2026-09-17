import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader, Section } from "@/components/ui";
import { ChangePasswordForm } from "@/components/change-password-form";

export const dynamic = "force-dynamic";

export default async function PortalSettingsPage() {
  const session = await requireClient();
  const client = await prisma.client.findUnique({ where: { id: session.clientId } });

  return (
    <>
      <PageHeader title="Pengaturan Akun" description="Kelola informasi login Anda." />

      <Section title="Akun">
        <Card className="max-w-md !p-0">
          <dl className="divide-y divide-line-soft text-sm">
            <div className="flex justify-between px-5 py-3">
              <dt className="text-muted">Nama</dt>
              <dd className="font-medium text-ink">{session.name}</dd>
            </div>
            <div className="flex justify-between px-5 py-3">
              <dt className="text-muted">Email</dt>
              <dd className="font-medium text-ink">{client?.email ?? "-"}</dd>
            </div>
            <div className="flex justify-between px-5 py-3">
              <dt className="text-muted">Perusahaan</dt>
              <dd className="font-medium text-ink">{client?.company ?? "-"}</dd>
            </div>
          </dl>
        </Card>
      </Section>

      <Section
        title="Ganti Password"
        description="Setelah diganti, designer tidak bisa melihat atau mengubah password Anda — hanya Anda yang tahu."
      >
        <Card className="max-w-md">
          <ChangePasswordForm />
        </Card>
      </Section>
    </>
  );
}
