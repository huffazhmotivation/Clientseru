import { notFound } from "next/navigation";
import { Mail, Phone, FileText, Package as PackageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatSigned } from "@/lib/format";
import { Card, EmptyState, PageHeader, Section } from "@/components/ui";
import { ClientForm } from "@/components/client-form";
import { QuotaForm } from "@/components/quota-form";
import { DeleteClientButton } from "@/components/delete-client-button";
import { ProgressQuotaCard } from "@/components/dashboard/progress-quota-card";
import { RequestGrid } from "@/components/dashboard/request-grid";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  TOPUP: "Penambahan",
  USAGE: "Pemakaian",
  ADJUST: "Koreksi",
};

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  const { id } = await params;

  const [client, packages] = await Promise.all([
    prisma.client.findUnique({
      where: { id },
      include: {
        quota: true,
        package: true,
        requests: { orderBy: { createdAt: "desc" }, include: { deliverables: { orderBy: { createdAt: "desc" } } } },
        history: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    }),
    prisma.package.findMany({ where: { designerId: session.userId }, orderBy: { quota: "asc" } }),
  ]);

  if (!client || !client.quota || client.designerId !== session.userId) notFound();

  const total = client.quota.totalQuota;
  const used = client.quota.usedQuota;

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
        eyebrow={client.active ? "Client aktif" : "Client nonaktif"}
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

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ProgressQuotaCard used={used} total={total} periodLabel={client.quota.periodLabel} className="lg:col-span-2" />
        <Card className="flex flex-col justify-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <PackageIcon className="h-4 w-4 text-subtle" />
            <span className="text-muted">Paket</span>
            <span className="ml-auto font-medium text-ink">{client.package?.name ?? "Tanpa paket"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-subtle" />
            <span className="text-muted">Email</span>
            <span className="ml-auto truncate font-medium text-ink">{client.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-subtle" />
            <span className="text-muted">Telepon</span>
            <span className="ml-auto font-medium text-ink">{client.phone ?? "—"}</span>
          </div>
        </Card>
      </div>

      {client.note ? (
        <Section title="Catatan">
          <Card>
            <p className="text-sm text-muted">{client.note}</p>
          </Card>
        </Section>
      ) : null}

      <Section title="Request desain" description={`${client.requests.length} total request dari client ini.`}>
        {client.requests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Belum ada request"
            hint="Request akan muncul setelah client mengirim permintaan desain."
          />
        ) : (
          <RequestGrid requests={client.requests} role="ADMIN" />
        )}
      </Section>

      <Section title="Riwayat kuota">
        {client.history.length === 0 ? (
          <EmptyState title="Belum ada pergerakan kuota" />
        ) : (
          <Card className="space-y-6">
            {Array.from(grouped.entries()).map(([date, entries]) => (
              <div key={date}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">{date}</p>
                <ul className="divide-y divide-line-soft">
                  {entries.map((entry) => (
                    <li key={entry.id} className="flex items-baseline justify-between gap-4 py-2.5">
                      <span className="text-sm text-ink">{entry.description}</span>
                      <span className="flex items-baseline gap-4 whitespace-nowrap">
                        <span className="text-xs text-subtle">{TYPE_LABEL[entry.type] ?? entry.type}</span>
                        <span
                          className={`w-12 text-right text-sm font-medium tabular-nums ${entry.amount < 0 ? "text-accentRose-600" : "text-accentEmerald-600"}`}
                        >
                          {formatSigned(entry.amount)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Card>
        )}
      </Section>

      <div className="border-t border-line pt-6">
        <DeleteClientButton clientId={client.id} company={client.company} />
      </div>
    </>
  );
}
