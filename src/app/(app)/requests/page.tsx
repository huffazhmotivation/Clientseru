import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import { KanbanBoard } from "@/components/dashboard/kanban-board";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const [requests, cancelledCount] = await Promise.all([
    prisma.designRequest.findMany({
      where: { status: { not: "CANCELLED" } },
      orderBy: { createdAt: "desc" },
      include: { client: { select: { id: true, company: true } } },
    }),
    prisma.designRequest.count({ where: { status: "CANCELLED" } }),
  ]);

  return (
    <>
      <PageHeader
        title="Requests"
        description="Seret kartu antar kolom untuk mengubah status. Kuota client terpotong otomatis saat status menjadi Done."
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
