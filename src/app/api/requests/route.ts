import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, parseBody, requireApiSession } from "@/lib/api";
import { requestCreateSchema } from "@/lib/validation";
import { requireOwnedClient } from "@/lib/quota";

export const GET = handler(async () => {
  const session = await requireApiSession();

  const requests = await prisma.designRequest.findMany({
    where:
      session.role === "CLIENT"
        ? { clientId: session.clientId ?? "" }
        : { client: { designerId: session.userId } },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { company: true } }, deliverables: { orderBy: { createdAt: "desc" } } },
    relationLoadStrategy: "join",
  });

  return json(requests);
});

export const POST = handler(async (request) => {
  const session = await requireApiSession();
  const input = await parseBody(request, requestCreateSchema);

  const clientId = session.role === "CLIENT" ? session.clientId : input.clientId;
  if (!clientId) throw new HttpError(422, "Client wajib dipilih");

  // Designer cuma boleh membuatkan request untuk client miliknya sendiri.
  if (session.role === "DESIGNER") await requireOwnedClient(session.userId, clientId);

  const quota = await prisma.clientQuota.findUnique({ where: { clientId } });
  if (!quota) throw new HttpError(404, "Data kuota client tidak ditemukan");

  // Catatan: pengecekan "sisa kuota tidak mencukupi" sengaja dinonaktifkan.
  // Request baru tetap boleh dibuat walau sisa kuota (termasuk yang masih
  // pending/pengerjaan) sudah habis atau minus. Saat request selesai (DONE),
  // usedQuota akan tetap bertambah lewat changeRequestStatus() di quota.ts
  // (yang juga sudah tidak menolak walau usedQuota jadi melebihi totalQuota).
  // Ketika client topup, totalQuota bertambah dan otomatis menutup minus itu.
  const cost = input.quotaCost ?? 1;

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
