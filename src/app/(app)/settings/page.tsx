import { PackageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { Card, Cell, EmptyState, PageHeader, Row, Section, Table } from "@/components/ui";
import { PackageForm } from "@/components/package-form";
import { ChangePasswordForm } from "@/components/change-password-form";

export const dynamic = "force-dynamic";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function SettingsPage() {
  const session = await requireAdmin();
  const packages = await prisma.package.findMany({
    where: { designerId: session.userId },
    orderBy: { quota: "asc" },
    include: { _count: { select: { clients: true } } },
  });

  return (
    <>
      <PageHeader title="Pengaturan" description="Paket desain dan informasi akun studio." />

      <Section title="Paket desain" description="Dipilih saat menambah client baru." action={<PackageForm />}>
        {packages.length === 0 ? (
          <EmptyState icon={PackageIcon} title="Belum ada paket" hint="Buat paket agar bisa dipilih saat menambah client." />
        ) : (
          <Table head={["Nama", "Kuota", "Harga", "Dipakai"]}>
            {packages.map((item) => (
              <Row key={item.id}>
                <Cell>
                  <span className="font-medium text-ink">{item.name}</span>
                </Cell>
                <Cell align="right">{item.quota} desain</Cell>
                <Cell align="right">{item.price > 0 ? rupiah.format(item.price) : "—"}</Cell>
                <Cell align="right">
                  <span className="rounded-full bg-wash px-2 py-0.5 text-xs font-medium text-muted">
                    {item._count.clients} client
                  </span>
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Section>

      <Section title="Akun">
        <Card className="max-w-md !p-0">
          <dl className="divide-y divide-line-soft text-sm">
            <div className="flex justify-between px-5 py-3">
              <dt className="text-muted">Nama</dt>
              <dd className="font-medium text-ink">{session.name}</dd>
            </div>
            <div className="flex justify-between px-5 py-3">
              <dt className="text-muted">Peran</dt>
              <dd className="font-medium text-ink">Designer (admin)</dd>
            </div>
          </dl>
        </Card>
      </Section>

      <Section
        title="Ganti Password"
        description="Password akun designer/admin ini. Untuk menambah akun designer baru, jalankan script create-admin (lihat README)."
      >
        <Card className="max-w-md">
          <ChangePasswordForm />
        </Card>
      </Section>
    </>
  );
}
