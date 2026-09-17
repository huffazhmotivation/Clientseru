import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, parseBody, requireApiSession } from "@/lib/api";
import { requestCreateSchema } from "@/lib/validation";

export const GET = handler(async () => {
  const session = await requireApiSession();

  const requests = await prisma.designRequest.findMany({
    where: session.role === "CLIENT" ? { clientId: session.clientId ?? "" } : undefined,
    orderBy: { createdAt: "desc" },
    include: { client: { select: { company: true } }, deliverables: { orderBy: { createdAt: "desc" } } },
  });

  return json(requests);
});

export const POST = handler(async (request) => {
  const session = await requireApiSession();
  const input = await parseBody(request, requestCreateSchema);

  const clientId = session.role === "CLIENT" ? session.clientId : input.clientId;
  if (!clientId) throw new HttpError(422, "Client wajib dipilih");

  const quota = await prisma.clientQuota.findUnique({ where: { clientId } });
  if (!quota) throw new HttpError(404, "Data kuota client tidak ditemukan");

  const pendingCost = await prisma.designRequest.aggregate({
    where: { clientId, status: { in: ["PENDING", "WORKING", "REVISION"] } },
    _sum: { quotaCost: true },
  });

  const cost = input.quotaCost ?? 1;
  const reserved = pendingCost._sum.quotaCost ?? 0;
  const available = quota.totalQuota - quota.usedQuota - reserved;
  if (available < cost) {
    throw new HttpError(400, "Sisa kuota tidak mencukupi untuk request baru");
  }

  const created = await prisma.designRequest.create({
    data: {
      clientId,
      title: input.title,
      description: input.description || null,
      quotaCost: cost,
      briefUrl: input.briefUrl || null,
      referenceUrl: input.referenceUrl || null,
    },
  });

  return json(created, 201);
});
