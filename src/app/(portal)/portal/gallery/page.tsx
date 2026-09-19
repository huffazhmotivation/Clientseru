import { Images } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/auth";
import { EmptyState, PageHeader } from "@/components/ui";
import { GalleryGrid, type GalleryItem } from "@/components/dashboard/gallery-grid";

export const dynamic = "force-dynamic";

export default async function PortalGalleryPage() {
  const session = await requireClient();

  const requests = await prisma.designRequest.findMany({
    where: { clientId: session.clientId },
    orderBy: { createdAt: "desc" },
    include: { deliverables: { orderBy: { createdAt: "desc" } } },
    relationLoadStrategy: "join",
  });

  const items: GalleryItem[] = requests
    .flatMap((request) =>
      request.deliverables.map((deliverable) => ({
        id: deliverable.id,
        type: deliverable.type,
        url: deliverable.url,
        name: deliverable.name,
        createdAt: deliverable.createdAt,
        requestId: request.id,
        requestTitle: request.title,
        requestStatus: request.status,
      })),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <PageHeader
        title="Galeri Hasil"
        description="Semua file dan link hasil kerja designer, dari seluruh request Anda. Bisa diunduh atau dibuka langsung."
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Images}
          title="Belum ada hasil kerja"
          hint="Hasil desain yang diunggah designer — file maupun link (Google Drive, dll) — akan muncul di sini."
        />
      ) : (
        <GalleryGrid items={items} />
      )}
    </>
  );
}
