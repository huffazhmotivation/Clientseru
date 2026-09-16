import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listClientsWithQuota } from "@/lib/quota";
import { formatDateTime } from "@/lib/format";
import { Cell, EmptyState, Metric, PageHeader, QuotaBar, Row, Section, StatusTag, Table } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [clients, openRequests, doneCount] = await Promise.all([
    listClientsWithQuota(),
    prisma.designRequest.findMany({
      where: { status: { in: ["PENDING", "WORKING", "REVISION"] } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { client: { select: { company: true } } },
    }),
    prisma.designRequest.count({ where: { status: "DONE" } }),
  ]);

  const active = clients.filter((client) => client.active);
  const totalQuota = clients.reduce((sum, client) => sum + client.total, 0);
  const usedQuota = clients.reduce((sum, client) => sum + client.used, 0);

  return (
    <>
      <PageHeader title="Dashboard" description="Ringkasan kuota seluruh client dan pekerjaan yang sedang berjalan." />

      <div className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        <Metric label="Client aktif" value={active.length} />
        <Metric label="Kuota terpakai" value={usedQuota} hint={`dari ${totalQuota} kuota`} />
        <Metric label="Request berjalan" value={openRequests.length} />
        <Metric label="Desain selesai" value={doneCount} />
      </div>

      <Section title="Client">
        {clients.length === 0 ? (
          <EmptyState title="Belum ada client" hint="Tambahkan client pertama di menu Clients." />
        ) : (
          <Table head={["Perusahaan", "Paket", "Total", "Terpakai", "Sisa", "Pemakaian"]}>
            {clients.map((client) => (
              <Row key={client.id}>
                <Cell>
                  <Link href={`/clients/${client.id}`} className="font-medium text-ink underline-offset-4 hover:underline">
                    {client.company}
                  </Link>
                  <span className="block text-xs text-muted">{client.name}</span>
                </Cell>
                <Cell>{client.package?.name ?? "—"}</Cell>
                <Cell align="right">{client.total}</Cell>
                <Cell align="right">{client.used}</Cell>
                <Cell align="right">{client.remaining}</Cell>
                <Cell>
                  <div className="w-28">
                    <QuotaBar used={client.used} total={client.total} />
                  </div>
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Section>

      <Section title="Request berjalan">
        {openRequests.length === 0 ? (
          <EmptyState title="Tidak ada request aktif" hint="Semua permintaan desain sudah diselesaikan." />
        ) : (
          <Table head={["Judul", "Client", "Masuk", "Status"]}>
            {openRequests.map((request) => (
              <Row key={request.id}>
                <Cell>{request.title}</Cell>
                <Cell>{request.client.company}</Cell>
                <Cell>{formatDateTime(request.createdAt)}</Cell>
                <Cell>
                  <StatusTag status={request.status} />
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Section>
    </>
  );
}
