import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, parseBody, requireApiAdmin } from "@/lib/api";
import { requestUpdateSchema } from "@/lib/validation";
import { changeRequestStatus } from "@/lib/quota";

type Context = { params: Promise<{ id: string }> };

export const PATCH = handler(async (request: Request, context: Context) => {
  const session = await requireApiAdmin();
  const { id } = await context.params;
  const input = await parseBody(request, requestUpdateSchema);

  const existing = await prisma.designRequest.findUnique({ where: { id }, include: { client: true } });
  if (!existing || existing.client.designerId !== session.userId) {
    throw new HttpError(404, "Request tidak ditemukan");
  }

  if (input.title || input.description !== undefined || input.quotaCost) {
    await prisma.designRequest.update({
      where: { id },
      data: {
        title: input.title ?? existing.title,
        description: input.description ?? existing.description,
        quotaCost: existing.quotaTaken ? existing.quotaCost : (input.quotaCost ?? existing.quotaCost),
      },
    });
  }

  const updated = input.status ? await changeRequestStatus(id, input.status) : await prisma.designRequest.findUnique({ where: { id } });

  return json(updated);
});
