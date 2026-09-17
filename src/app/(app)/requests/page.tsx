import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { ClientFilter } from "@/components/dashboard/client-filter";

export const dynamic = "force-dynamic";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: clientId } = await searchParams;

  const [requests, cancelledCount, clients] = await Promise.all([
    prisma.designRequest.findMany({
      where: {
        status: { not: "CANCELLED" },
        ...(clientId ? { clientId } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, company: true } },
        deliverables: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.designRequest.count({ where: { status: "CANCELLED" } }),
    prisma.client.findMany({ orderBy: { company: "asc" }, select: { id: true, company: true } }),
  ]);

  return (
    <>
      <PageHeader
        title="Requests"
        description="Klik kartu untuk lihat detail brief & upload hasil kerja. Seret antar kolom untuk mengubah status — kuota client terpotong otomatis saat status menjadi Done."
        action={<ClientFilter clients={clients} selected={clientId} />}
      />

      <KanbanBoard requests={requests} />

      {cancelledCount > 0 ? (
        <p className="mt-6 text-xs text-subtle">
          {cancelledCount} request berstatus dibatalkan disembunyikan dari board — lihat di{" "}
          <a href="/history" className="font-medium text-brand-600 hover:underline">
            riwayat kuota
          </a>
          .
        </p>
      ) : null}
    </>
  );
}
