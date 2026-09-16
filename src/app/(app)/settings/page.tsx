import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { Cell, EmptyState, PageHeader, Row, Section, Table } from "@/components/ui";
import { PackageForm } from "@/components/package-form";

export const dynamic = "force-dynamic";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function SettingsPage() {
  const session = await requireAdmin();
  const packages = await prisma.package.findMany({
    orderBy: { quota: "asc" },
    include: { _count: { select: { clients: true } } },
  });

  return (
    <>
      <PageHeader title="Pengaturan" description="Paket desain dan informasi akun." />

      <Section title="Paket desain" action={<PackageForm />}>
        {packages.length === 0 ? (
          <EmptyState title="Belum ada paket" hint="Buat paket agar bisa dipilih saat menambah client." />
        ) : (
          <Table head={["Nama", "Kuota", "Harga", "Dipakai"]}>
            {packages.map((item) => (
              <Row key={item.id}>
                <Cell>{item.name}</Cell>
                <Cell align="right">{item.quota}</Cell>
                <Cell align="right">{item.price > 0 ? rupiah.format(item.price) : "—"}</Cell>
                <Cell align="right">{item._count.clients} client</Cell>
              </Row>
            ))}
          </Table>
        )}
      </Section>

      <Section title="Akun">
        <dl className="max-w-md divide-y divide-line border-t border-line text-sm">
          <div className="flex justify-between py-2.5">
            <dt className="text-muted">Nama</dt>
            <dd>{session.name}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-muted">Peran</dt>
            <dd>Designer (admin)</dd>
          </div>
        </dl>
        <p className="mt-3 max-w-md text-xs text-muted">
          Password admin diatur lewat file seed. Ganti nilai ADMIN_PASSWORD lalu jalankan ulang seed bila perlu.
        </p>
      </Section>
    </>
  );
}
