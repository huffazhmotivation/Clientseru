import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listClientsWithQuota } from "@/lib/quota";
import { Cell, EmptyState, PageHeader, Row, Table } from "@/components/ui";
import { ClientForm } from "@/components/client-form";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const [clients, packages] = await Promise.all([
    listClientsWithQuota(),
    prisma.package.findMany({ orderBy: { quota: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        title="Clients"
        description="Daftar client beserta sisa kuota desainnya."
        action={<ClientForm packages={packages} />}
      />

      {clients.length === 0 ? (
        <EmptyState title="Belum ada client" hint="Tambahkan client untuk mulai mencatat kuota." />
      ) : (
        <Table head={["Perusahaan", "PIC", "Email", "Total", "Terpakai", "Sisa"]}>
          {clients.map((client) => (
            <Row key={client.id}>
              <Cell>
                <Link href={`/clients/${client.id}`} className="font-medium text-ink underline-offset-4 hover:underline">
                  {client.company}
                </Link>
              </Cell>
              <Cell>{client.name}</Cell>
              <Cell>
                <span className="text-muted">{client.email}</span>
              </Cell>
              <Cell align="right">{client.total}</Cell>
              <Cell align="right">{client.used}</Cell>
              <Cell align="right">
                <span className="font-medium">{client.remaining}</span>
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
}
