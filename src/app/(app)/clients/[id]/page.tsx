import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime, formatSigned } from "@/lib/format";
import { Cell, EmptyState, Metric, PageHeader, QuotaBar, Row, Section, StatusTag, Table } from "@/components/ui";
import { ClientForm } from "@/components/client-form";
import { QuotaForm } from "@/components/quota-form";
import { DeleteClientButton } from "@/components/delete-client-button";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  TOPUP: "Penambahan",
  USAGE: "Pemakaian",
  ADJUST: "Koreksi",
};

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [client, packages] = await Promise.all([
    prisma.client.findUnique({
      where: { id },
      include: {
        quota: true,
        package: true,
        requests: { orderBy: { createdAt: "desc" } },
        history: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    }),
    prisma.package.findMany({ orderBy: { quota: "asc" } }),
  ]);

  if (!client || !client.quota) notFound();

  const total = client.quota.totalQuota;
  const used = client.quota.usedQuota;

  // Kelompokkan riwayat per tanggal agar mudah dibaca.
  const grouped = new Map<string, typeof client.history>();
  for (const entry of client.history) {
    const key = formatDate(entry.createdAt);
    const list = grouped.get(key) ?? [];
    list.push(entry);
    grouped.set(key, list);
  }

  return (
    <>
      <PageHeader
        title={client.company}
        description={`${client.name} · ${client.email}${client.phone ? ` · ${client.phone}` : ""}`}
        action={
          <div className="flex flex-wrap gap-2">
            <ClientForm
              packages={packages}
              trigger="Edit"
              client={{
                id: client.id,
                name: client.name,
                company: client.company,
                email: client.email,
                phone: client.phone,
                note: client.note,
                packageId: client.packageId,
                totalQuota: total,
              }}
            />
            <QuotaForm clientId={client.id} />
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-6 md:grid-cols-4">
        <Metric label="Paket" value={<span className="text-lg">{client.package?.name ?? "Tanpa paket"}</span>} />
        <Metric label="Total kuota" value={total} />
        <Metric label="Terpakai" value={used} />
        <Metric label="Sisa" value={total - used} />
      </div>
      <div className="mb-10">
        <QuotaBar used={used} total={total} />
      </div>

      {client.note ? (
        <Section title="Catatan">
          <p className="max-w-2xl text-sm text-muted">{client.note}</p>
        </Section>
      ) : null}

      <Section title="Request desain">
        {client.requests.length === 0 ? (
          <EmptyState title="Belum ada request" hint="Request akan muncul setelah client mengirim permintaan desain." />
        ) : (
          <Table head={["Judul", "Masuk", "Kuota", "Status", "Lampiran"]}>
            {client.requests.map((request) => (
              <Row key={request.id}>
                <Cell>{request.title}</Cell>
                <Cell>{formatDateTime(request.createdAt)}</Cell>
                <Cell align="right">{request.quotaCost}</Cell>
                <Cell>
                  <StatusTag status={request.status} />
                </Cell>
                <Cell>
                  {request.briefUrl ? (
                    <Link href={request.briefUrl} className="text-muted underline underline-offset-4 hover:text-ink" target="_blank">
                      Brief
                    </Link>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Section>

      <Section title="Riwayat kuota">
        {client.history.length === 0 ? (
          <EmptyState title="Belum ada pergerakan kuota" />
        ) : (
          <div className="space-y-6">
            {Array.from(grouped.entries()).map(([date, entries]) => (
              <div key={date}>
                <p className="mb-2 text-xs text-muted">{date}</p>
                <ul className="border-t border-line">
                  {entries.map((entry) => (
                    <li key={entry.id} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                      <span className="text-sm text-ink">{entry.description}</span>
                      <span className="flex items-baseline gap-4 whitespace-nowrap">
                        <span className="text-xs text-muted">{TYPE_LABEL[entry.type] ?? entry.type}</span>
                        <span className="w-12 text-right text-sm font-medium tabular-nums">
                          {formatSigned(entry.amount)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="border-t border-line pt-6">
        <DeleteClientButton clientId={client.id} company={client.company} />
      </div>
    </>
  );
}
