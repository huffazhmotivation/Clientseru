import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, requireApiAdmin } from "@/lib/api";

type Context = { params: Promise<{ id: string; deliverableId: string }> };

/** Hanya admin/designer yang boleh menghapus hasil kerja yang salah upload. */
export const DELETE = handler(async (_request: Request, context: Context) => {
  await requireApiAdmin();
  const { id, deliverableId } = await context.params;

  const existing = await prisma.deliverable.findUnique({ where: { id: deliverableId } });
  if (!existing || existing.requestId !== id) throw new HttpError(404, "Lampiran hasil tidak ditemukan");

  await prisma.deliverable.delete({ where: { id: deliverableId } });

  return json({ ok: true });
});
