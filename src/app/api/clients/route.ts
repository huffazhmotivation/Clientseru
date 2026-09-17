import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, parseBody, requireApiAdmin } from "@/lib/api";
import { clientSchema } from "@/lib/validation";
import { listClientsWithQuota } from "@/lib/quota";

export const GET = handler(async () => {
  const session = await requireApiAdmin();
  return json(await listClientsWithQuota(session.userId));
});

export const POST = handler(async (request) => {
  const session = await requireApiAdmin();
  const input = await parseBody(request, clientSchema);
  const email = input.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "Email sudah dipakai akun lain");
  if (!input.password) throw new HttpError(422, "Password login client wajib diisi");

  const selectedPackage = input.packageId
    ? await prisma.package.findFirst({ where: { id: input.packageId, designerId: session.userId } })
    : null;
  if (input.packageId && !selectedPackage) throw new HttpError(404, "Paket tidak ditemukan");

  const totalQuota = input.totalQuota > 0 ? input.totalQuota : (selectedPackage?.quota ?? 0);
  const passwordHash = await bcrypt.hash(input.password, 10);

  const client = await prisma.$transaction(async (tx) => {
    const created = await tx.client.create({
      data: {
        name: input.name,
        company: input.company,
        email,
        phone: input.phone || null,
        note: input.note || null,
        packageId: selectedPackage?.id ?? null,
        designerId: session.userId,
        quota: { create: { totalQuota, usedQuota: 0 } },
      },
    });

    await tx.user.create({
      data: {
        name: input.name,
        email,
        password: passwordHash,
        role: "CLIENT",
        clientId: created.id,
      },
    });

    if (totalQuota > 0) {
      await tx.quotaHistory.create({
        data: {
          clientId: created.id,
          type: "TOPUP",
          amount: totalQuota,
          description: selectedPackage ? `Kuota awal paket ${selectedPackage.name}` : "Kuota awal",
        },
      });
    }

    return created;
  });

  return json(client, 201);
});
