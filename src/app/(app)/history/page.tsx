import Link from "next/link";
import { History as HistoryIcon } from "lucide-react";
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
        <EmptyState icon={HistoryIcon} title="Belum ada riwayat" />
      ) : (
        <Table head={["Waktu", "Client", "Keterangan", "Jenis", "Jumlah"]}>
          {history.map((entry) => (
            <Row key={entry.id}>
              <Cell>
                <span className="text-muted">{formatDateTime(entry.createdAt)}</span>
              </Cell>
              <Cell>
                <Link href={`/clients/${entry.client.id}`} className="font-medium text-ink underline-offset-4 hover:text-brand-600 hover:underline">
                  {entry.client.company}
                </Link>
              </Cell>
              <Cell>{entry.description}</Cell>
              <Cell>
                <span className="rounded-full bg-wash px-2 py-0.5 text-xs font-medium text-muted">
                  {TYPE_LABEL[entry.type] ?? entry.type}
                </span>
              </Cell>
              <Cell align="right">
                <span className={`font-semibold ${entry.amount < 0 ? "text-accentRose-600" : "text-accentEmerald-600"}`}>
                  {formatSigned(entry.amount)}
                </span>
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
}
