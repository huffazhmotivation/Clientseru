import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { Cell, EmptyState, LinkButton, PageHeader, Row, StatusTag, Table } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PortalRequestsPage() {
  const session = await requireClient();
  const requests = await prisma.designRequest.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="Request desain"
        description="Status pekerjaan diperbarui oleh designer. Kuota terpotong saat desain selesai."
        action={<LinkButton href="/portal/requests/new">Request desain</LinkButton>}
      />

      {requests.length === 0 ? (
        <EmptyState title="Belum ada request" hint="Kirim permintaan desain pertama Anda." />
      ) : (
        <Table head={["Judul", "Dikirim", "Kuota", "Lampiran", "Status"]}>
          {requests.map((request) => (
            <Row key={request.id}>
              <Cell>
                <span className="font-medium text-ink">{request.title}</span>
                {request.description ? (
                  <span className="mt-0.5 block max-w-sm truncate text-xs text-muted">{request.description}</span>
                ) : null}
              </Cell>
              <Cell>{formatDate(request.createdAt)}</Cell>
              <Cell align="right">{request.quotaCost}</Cell>
              <Cell>
                {request.briefUrl ? (
                  <Link href={request.briefUrl} target="_blank" className="text-muted underline underline-offset-4 hover:text-ink">
                    Brief
                  </Link>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </Cell>
              <Cell>
                <StatusTag status={request.status} />
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
}
