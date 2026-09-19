import type { Prisma, QuotaEntryType, RequestStatus } from "@prisma/client";
import { prisma } from "./prisma";
import { HttpError } from "./api";

/**
 * Semua aturan kuota ada di file ini supaya tidak tersebar di banyak route.
 * Aturan:
 * - Kuota dipotong saat request berubah menjadi DONE (sekali saja).
 * - Kalau status DONE dibatalkan, kuota dikembalikan.
 * - Penambahan manual dicatat sebagai TOPUP, koreksi sebagai ADJUST.
 */

type Tx = Prisma.TransactionClient;

async function getQuotaOrThrow(tx: Tx, clientId: string) {
  const quota = await tx.clientQuota.findUnique({ where: { clientId } });
  if (!quota) throw new HttpError(404, "Data kuota client tidak ditemukan");
  return quota;
}

export async function adjustQuota(input: {
  clientId: string;
  type: Extract<QuotaEntryType, "TOPUP" | "ADJUST">;
  amount: number;
  description: string;
}) {
  return prisma.$transaction(async (tx) => {
    const quota = await getQuotaOrThrow(tx, input.clientId);
    const nextTotal = quota.totalQuota + input.amount;
    if (nextTotal < quota.usedQuota) {
      throw new HttpError(400, "Total kuota tidak boleh lebih kecil dari kuota terpakai");
    }

    const updated = await tx.clientQuota.update({
      where: { clientId: input.clientId },
      data: { totalQuota: nextTotal },
    });

    await tx.quotaHistory.create({
      data: {
        clientId: input.clientId,
        type: input.type,
        amount: input.amount,
        description: input.description,
      },
    });

    return updated;
  });
}

export async function changeRequestStatus(requestId: string, status: RequestStatus) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.designRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new HttpError(404, "Request tidak ditemukan");
    if (request.status === status) return request;

    const shouldTake = status === "DONE" && !request.quotaTaken;
    const shouldReturn = status !== "DONE" && request.quotaTaken;

    if (shouldTake) {
      const quota = await getQuotaOrThrow(tx, request.clientId);
      if (quota.usedQuota + request.quotaCost > quota.totalQuota) {
        throw new HttpError(400, "Kuota client tidak mencukupi. Tambahkan kuota terlebih dahulu.");
      }
      await tx.clientQuota.update({
        where: { clientId: request.clientId },
        data: { usedQuota: { increment: request.quotaCost } },
      });
      await tx.quotaHistory.create({
        data: {
          clientId: request.clientId,
          type: "USAGE",
          amount: -request.quotaCost,
          description: request.title,
          requestId: request.id,
        },
      });
    }

    if (shouldReturn) {
      await tx.clientQuota.update({
        where: { clientId: request.clientId },
        data: { usedQuota: { decrement: request.quotaCost } },
      });
      await tx.quotaHistory.create({
        data: {
          clientId: request.clientId,
          type: "ADJUST",
          amount: request.quotaCost,
          description: `Pengembalian kuota: ${request.title}`,
          requestId: request.id,
        },
      });
    }

    return tx.designRequest.update({
      where: { id: requestId },
      data: {
        status,
        quotaTaken: shouldTake ? true : shouldReturn ? false : request.quotaTaken,
        doneAt: status === "DONE" ? new Date() : null,
      },
    });
  });
}

export async function getClientOverview(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { quota: true, package: true },
    relationLoadStrategy: "join",
  });
  if (!client || !client.quota) return null;

  return {
    ...client,
    quota: client.quota,
    remaining: client.quota.totalQuota - client.quota.usedQuota,
  };
}

/** Pastikan client tertentu memang milik designer yang sedang login. Melempar 404 kalau bukan (bukan 403, supaya tidak bocorin keberadaan client designer lain). */
export async function requireOwnedClient(designerId: string, clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client || client.designerId !== designerId) {
    throw new HttpError(404, "Client tidak ditemukan");
  }
  return client;
}

export async function listClientsWithQuota(designerId: string) {
  const clients = await prisma.client.findMany({
    where: { designerId },
    orderBy: [{ active: "desc" }, { company: "asc" }],
    // "join" = satu query SQL untuk client + kuota + paket (default-nya 1 query per relasi,
    // masing-nya satu kali bolak-balik ke database). _count.requests dibuang karena tidak
    // dipakai di UI mana pun dan menambah satu query lagi.
    include: {
      quota: true,
      package: true,
    },
    relationLoadStrategy: "join",
  });

  return clients.map((client) => {
    const total = client.quota?.totalQuota ?? 0;
    const used = client.quota?.usedQuota ?? 0;
    return { ...client, total, used, remaining: total - used };
  });
}

/** Nama designer yang menangani client ini — dipakai di header portal client. */
export async function getStudioName(clientId: string): Promise<string> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { designer: { select: { name: true } } },
    relationLoadStrategy: "join",
  });
  return client?.designer?.name ?? "ClientSeru Studio";
}
