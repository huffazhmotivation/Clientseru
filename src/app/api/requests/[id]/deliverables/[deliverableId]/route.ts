import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, requireApiDesigner } from "@/lib/api";

type Context = { params: Promise<{ id: string; deliverableId: string }> };

/** Hanya designer pemilik client-nya yang boleh menghapus hasil kerja yang salah upload. */
export const DELETE = handler(async (_request: Request, context: Context) => {
  const session = await requireApiDesigner();
  const { id, deliverableId } = await context.params;

  const existing = await prisma.deliverable.findUnique({
    where: { id: deliverableId },
    include: { request: { include: { client: true } } },
  });
  if (!existing || existing.requestId !== id || existing.request.client.designerId !== session.userId) {
    throw new HttpError(404, "Lampiran hasil tidak ditemukan");
  }

  await prisma.deliverable.delete({ where: { id: deliverableId } });

  return json({ ok: true });
});
