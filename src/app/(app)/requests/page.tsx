import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { Cell, EmptyState, PageHeader, Row, Table } from "@/components/ui";
import { StatusSelect } from "@/components/status-select";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const requests = await prisma.designRequest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { client: { select: { company: true } } },
  });

  return (
    <>
      <PageHeader
        title="Requests"
        description="Ubah status pekerjaan di sini. Kuota client terpotong otomatis saat status menjadi Selesai."
      />

      {requests.length === 0 ? (
        <EmptyState title="Belum ada request masuk" />
      ) : (
        <Table head={["Judul", "Client", "Masuk", "Kuota", "Lampiran", "Status"]}>
          {requests.map((request) => (
            <Row key={request.id}>
              <Cell>
                <span className="font-medium text-ink">{request.title}</span>
                {request.description ? (
                  <span className="mt-0.5 block max-w-sm truncate text-xs text-muted">{request.description}</span>
                ) : null}
              </Cell>
              <Cell>{request.client.company}</Cell>
              <Cell>{formatDateTime(request.createdAt)}</Cell>
              <Cell align="right">{request.quotaCost}</Cell>
              <Cell>
                <div className="flex gap-3 text-sm">
                  {request.briefUrl ? (
                    <Link href={request.briefUrl} target="_blank" className="text-muted underline underline-offset-4 hover:text-ink">
                      Brief
                    </Link>
                  ) : null}
                  {request.referenceUrl ? (
                    <Link href={request.referenceUrl} target="_blank" className="text-muted underline underline-offset-4 hover:text-ink">
                      Referensi
                    </Link>
                  ) : null}
                  {!request.briefUrl && !request.referenceUrl ? <span className="text-muted">—</span> : null}
                </div>
              </Cell>
              <Cell>
                <StatusSelect requestId={request.id} status={request.status} />
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
}
