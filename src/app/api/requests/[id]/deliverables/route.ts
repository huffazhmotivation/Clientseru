import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, parseBody, requireApiAdmin, requireApiSession } from "@/lib/api";
import { deliverableCreateSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

/** Client & admin boleh melihat daftar hasil kerja untuk satu request (dibatasi kepemilikan client). */
export const GET = handler(async (_request: Request, context: Context) => {
  const session = await requireApiSession();
  const { id } = await context.params;

  const existing = await prisma.designRequest.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Request tidak ditemukan");
  if (session.role === "CLIENT" && existing.clientId !== session.clientId) {
    throw new HttpError(403, "Anda tidak memiliki akses ke request ini");
  }

  const deliverables = await prisma.deliverable.findMany({
    where: { requestId: id },
    orderBy: { createdAt: "desc" },
  });

  return json(deliverables);
});

/** Hanya admin/designer yang boleh menambahkan hasil kerja (file upload atau link). */
export const POST = handler(async (request: Request, context: Context) => {
  await requireApiAdmin();
  const { id } = await context.params;
  const input = await parseBody(request, deliverableCreateSchema);

  const existing = await prisma.designRequest.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Request tidak ditemukan");

  const created = await prisma.deliverable.create({
    data: {
      requestId: id,
      type: input.type,
      url: input.url,
      name: input.name,
    },
  });

  return json(created, 201);
});
