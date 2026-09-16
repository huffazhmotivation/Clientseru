import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/auth";
import { getClientOverview } from "@/lib/quota";
import { formatDate, formatSigned } from "@/lib/format";
import { EmptyState, LinkButton, Metric, PageHeader, QuotaBar, Section, StatusTag } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const session = await requireClient();
  const overview = await getClientOverview(session.clientId);
  if (!overview) notFound();

  const [requests, history] = await Promise.all([
    prisma.designRequest.findMany({
      where: { clientId: session.clientId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.quotaHistory.findMany({
      where: { clientId: session.clientId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <>
      <PageHeader
        title={overview.company}
        description={overview.package ? `Paket ${overview.package.name}` : "Tanpa paket aktif"}
        action={<LinkButton href="/portal/requests/new">Request desain</LinkButton>}
      />

      <div className="mb-4 grid grid-cols-3 gap-6">
        <Metric label="Total kuota" value={overview.quota.totalQuota} />
        <Metric label="Digunakan" value={overview.quota.usedQuota} />
        <Metric label="Tersisa" value={overview.remaining} />
      </div>
      <div className="mb-10">
        <QuotaBar used={overview.quota.usedQuota} total={overview.quota.totalQuota} />
      </div>

      <Section title="Request terbaru">
        {requests.length === 0 ? (
          <EmptyState title="Belum ada request" hint="Kirim permintaan desain pertama Anda." />
        ) : (
          <ul className="border-t border-line">
            {requests.map((request) => (
              <li key={request.id} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                <span>
                  <span className="text-sm text-ink">{request.title}</span>
                  <span className="block text-xs text-muted">{formatDate(request.createdAt)}</span>
                </span>
                <StatusTag status={request.status} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Riwayat kuota">
        {history.length === 0 ? (
          <EmptyState title="Belum ada pergerakan kuota" />
        ) : (
          <ul className="border-t border-line">
            {history.map((entry) => (
              <li key={entry.id} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                <span>
                  <span className="text-sm text-ink">{entry.description}</span>
                  <span className="block text-xs text-muted">{formatDate(entry.createdAt)}</span>
                </span>
                <span className="text-sm font-medium tabular-nums">{formatSigned(entry.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
