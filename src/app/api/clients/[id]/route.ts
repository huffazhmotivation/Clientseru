import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, parseBody, requireApiAdmin } from "@/lib/api";
import { clientUpdateSchema } from "@/lib/validation";
import { requireOwnedClient } from "@/lib/quota";

type Context = { params: Promise<{ id: string }> };

export const PATCH = handler(async (request: Request, context: Context) => {
  const session = await requireApiAdmin();
  const { id } = await context.params;
  const input = await parseBody(request, clientUpdateSchema);

  const client = await requireOwnedClient(session.userId, id);

  if (input.packageId) {
    const owned = await prisma.package.findFirst({ where: { id: input.packageId, designerId: session.userId } });
    if (!owned) throw new HttpError(404, "Paket tidak ditemukan");
  }

  const updated = await prisma.client.update({
    where: { id },
    data: {
      name: input.name ?? client.name,
      company: input.company ?? client.company,
      email: input.email ? input.email.toLowerCase() : client.email,
      phone: input.phone === undefined ? client.phone : input.phone || null,
      note: input.note === undefined ? client.note : input.note || null,
      packageId: input.packageId === undefined ? client.packageId : input.packageId || null,
    },
  });

  return json(updated);
});

export const DELETE = handler(async (_request: Request, context: Context) => {
  const session = await requireApiAdmin();
  const { id } = await context.params;

  await requireOwnedClient(session.userId, id);

  await prisma.client.delete({ where: { id } });
  return json({ ok: true });
});
