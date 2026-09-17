import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, parseBody, requireApiDesigner } from "@/lib/api";
import { clientSchema } from "@/lib/validation";
import { listClientsWithQuota } from "@/lib/quota";
import { buildInviteLink, createInvitation } from "@/lib/invite";

export const GET = handler(async () => {
  const session = await requireApiDesigner();
  return json(await listClientsWithQuota(session.userId));
});

/**
 * Designer hanya mengisi data client (nama, perusahaan, email, dll) — TIDAK ada input password di sini.
 * Client belum punya akun login. Yang dibuat adalah baris Client + 1 token undangan (ClientInvitation).
 * Client baru bisa login setelah membuka /invite/[token] dan membuat password sendiri.
 */
export const POST = handler(async (request) => {
  const session = await requireApiDesigner();
  const input = await parseBody(request, clientSchema);
  const email = input.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new HttpError(409, "Email sudah dipakai akun lain");

  const existingClient = await prisma.client.findUnique({ where: { email } });
  if (existingClient) throw new HttpError(409, "Email ini sudah terdaftar sebagai client");

  const selectedPackage = input.packageId
    ? await prisma.package.findFirst({ where: { id: input.packageId, designerId: session.userId } })
    : null;
  if (input.packageId && !selectedPackage) throw new HttpError(404, "Paket tidak ditemukan");

  const totalQuota = input.totalQuota > 0 ? input.totalQuota : (selectedPackage?.quota ?? 0);

  const { client, invitation } = await prisma.$transaction(async (tx) => {
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

    const createdInvitation = await createInvitation(tx, {
      clientId: created.id,
      designerId: session.userId,
      name: input.name,
      email,
    });

    return { client: created, invitation: createdInvitation };
  });

  const inviteLink = buildInviteLink(new URL(request.url).origin, invitation.token);

  return json({ ...client, inviteLink }, 201);
});
