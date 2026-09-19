import { FilePlus2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/auth";
import { getStudioName } from "@/lib/quota";
import { EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { RequestGrid } from "@/components/dashboard/request-grid";

export const dynamic = "force-dynamic";

export default async function PortalRequestsPage() {
  const session = await requireClient();
  const [requests, studioName] = await Promise.all([
    prisma.designRequest.findMany({
      where: { clientId: session.clientId },
      orderBy: { createdAt: "desc" },
      include: { deliverables: { orderBy: { createdAt: "desc" } } },
      relationLoadStrategy: "join",
    }),
    getStudioName(session.clientId),
  ]);

  return (
    <>
      <PageHeader
        title="Request desain"
        description="Status pekerjaan diperbarui oleh designer. Kuota terpotong otomatis saat desain selesai."
        action={<LinkButton href="/portal/requests/new" variant="primary" icon={<FilePlus2 className="h-4 w-4" />}>Request desain</LinkButton>}
      />

      {requests.length === 0 ? (
        <EmptyState
          title="Belum ada request"
          hint="Kirim permintaan desain pertama Anda — cukup isi judul, brief, dan referensi jika ada."
          icon={FilePlus2}
          action={<LinkButton href="/portal/requests/new" variant="primary">Buat Request Desain</LinkButton>}
        />
      ) : (
        <RequestGrid requests={requests} role="CLIENT" personLabel="Designer" personName={studioName} />
      )}
    </>
  );
}
