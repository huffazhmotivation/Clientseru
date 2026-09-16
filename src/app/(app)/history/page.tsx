import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatSigned } from "@/lib/format";
import { Cell, EmptyState, PageHeader, Row, Table } from "@/components/ui";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  TOPUP: "Penambahan",
  USAGE: "Pemakaian",
  ADJUST: "Koreksi",
};

export default async function HistoryPage() {
  const history = await prisma.quotaHistory.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { client: { select: { id: true, company: true } } },
  });

  return (
    <>
      <PageHeader title="Riwayat kuota" description="Seluruh pergerakan kuota dari semua client, terbaru di atas." />

      {history.length === 0 ? (
        <EmptyState title="Belum ada riwayat" />
      ) : (
        <Table head={["Waktu", "Client", "Keterangan", "Jenis", "Jumlah"]}>
          {history.map((entry) => (
            <Row key={entry.id}>
              <Cell>{formatDateTime(entry.createdAt)}</Cell>
              <Cell>
                <Link href={`/clients/${entry.client.id}`} className="underline-offset-4 hover:underline">
                  {entry.client.company}
                </Link>
              </Cell>
              <Cell>{entry.description}</Cell>
              <Cell>
                <span className="text-muted">{TYPE_LABEL[entry.type] ?? entry.type}</span>
              </Cell>
              <Cell align="right">
                <span className="font-medium">{formatSigned(entry.amount)}</span>
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
}
