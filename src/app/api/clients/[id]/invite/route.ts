import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, requireApiDesigner } from "@/lib/api";
import { requireOwnedClient } from "@/lib/quota";
import { buildInviteLink, generateInviteToken } from "@/lib/invite";

type Context = { params: Promise<{ id: string }> };

/** Ambil status undangan client ini (untuk ditampilkan di halaman detail client). */
export const GET = handler(async (_request: Request, context: Context) => {
  const session = await requireApiDesigner();
  const { id } = await context.params;
  await requireOwnedClient(session.userId, id);

  const invitation = await prisma.clientInvitation.findUnique({ where: { clientId: id } });
  const activated = await prisma.user.findFirst({ where: { clientId: id }, select: { id: true } });

  return json({
    activated: Boolean(activated),
    invitation: invitation && !activated ? { token: invitation.token, usedAt: invitation.usedAt } : null,
  });
});

/**
 * Buat ulang token undangan (misalnya link lama hilang/kadaluarsa secara praktis).
 * Ditolak kalau client sudah pernah aktivasi (sudah punya akun login) supaya akun aktif tidak bisa "diambil alih".
 */
export const POST = handler(async (request: Request, context: Context) => {
  const session = await requireApiDesigner();
  const { id } = await context.params;
  const client = await requireOwnedClient(session.userId, id);

  const activated = await prisma.user.findFirst({ where: { clientId: id } });
  if (activated) throw new HttpError(409, "Client ini sudah aktivasi akun, tidak bisa dibuatkan undangan baru");

  const token = generateInviteToken();
  const invitation = await prisma.clientInvitation.upsert({
    where: { clientId: id },
    update: { token, usedAt: null },
    create: { token, name: client.name, email: client.email, clientId: id, designerId: session.userId },
  });

  const inviteLink = buildInviteLink(new URL(request.url).origin, invitation.token);
  return json({ inviteLink });
});
