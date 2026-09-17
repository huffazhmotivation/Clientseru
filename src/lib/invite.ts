import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { HttpError } from "./api";

/**
 * Semua logika undangan aktivasi client ada di sini.
 * Alur:
 * 1. Designer menambah client (menu Client → Tambah Client) → Client dibuat TANPA akun login,
 *    sekaligus dibuat 1 baris ClientInvitation dengan token unik.
 * 2. Client membuka /invite/[token] → melihat undangan (nama, perusahaan, designer) → membuat password sendiri.
 * 3. Setelah submit, akun User (role CLIENT, clientId = client ini) dibuat, dan invitation
 *    ditandai usedAt supaya token tidak bisa dipakai ulang (sekali pakai).
 */

/** Token URL-safe, cukup panjang supaya tidak bisa ditebak. */
export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/** Buat undangan baru untuk sebuah client yang baru dibuat. Dipanggil di dalam transaksi yang sama dengan pembuatan Client. */
export async function createInvitation(
  tx: Prisma.TransactionClient,
  input: { clientId: string; designerId: string; name: string; email: string },
) {
  return tx.clientInvitation.create({
    data: {
      token: generateInviteToken(),
      name: input.name,
      email: input.email,
      clientId: input.clientId,
      designerId: input.designerId,
    },
  });
}

/** Ambil detail undangan yang masih valid (ada & belum dipakai). Melempar 404/410 kalau tidak valid. */
export async function getValidInvitation(token: string) {
  const invitation = await prisma.clientInvitation.findUnique({
    where: { token },
    include: { client: { include: { designer: true } } },
  });

  if (!invitation) throw new HttpError(404, "Link undangan tidak ditemukan");
  if (invitation.usedAt) throw new HttpError(410, "Link undangan ini sudah pernah dipakai");

  return invitation;
}

/**
 * Aktivasi: client membuat password sendiri.
 * - Token divalidasi & ditandai sekali pakai di dalam transaksi (mencegah race condition dipakai 2x bersamaan).
 * - Kalau ternyata email sudah dipakai akun lain (mis. sudah pernah diaktivasi lewat token lama), ditolak.
 */
export async function activateInvitation(token: string, password: string) {
  return prisma.$transaction(async (tx) => {
    const invitation = await tx.clientInvitation.findUnique({ where: { token } });
    if (!invitation) throw new HttpError(404, "Link undangan tidak ditemukan");
    if (invitation.usedAt) throw new HttpError(410, "Link undangan ini sudah pernah dipakai");

    const existingUser = await tx.user.findUnique({ where: { email: invitation.email } });
    if (existingUser) throw new HttpError(409, "Email ini sudah punya akun login");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await tx.user.create({
      data: {
        name: invitation.name,
        email: invitation.email,
        password: passwordHash,
        role: "CLIENT",
        clientId: invitation.clientId,
      },
    });

    await tx.clientInvitation.update({
      where: { id: invitation.id },
      data: { usedAt: new Date() },
    });

    return user;
  });
}

export function buildInviteLink(origin: string, token: string): string {
  return `${origin}/invite/${token}`;
}
