import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, parseBody, requireApiSession } from "@/lib/api";
import { changePasswordSchema } from "@/lib/validation";

/**
 * Ganti password milik akun yang sedang login (admin ATAUPUN client).
 * Sengaja tidak ada endpoint terpisah untuk admin mengubah password client:
 * setelah client login & set password sendiri, hanya client itu sendiri
 * yang bisa menggantinya lagi (harus tahu password lama).
 */
export const PATCH = handler(async (request) => {
  const session = await requireApiSession();
  const { currentPassword, newPassword } = await parseBody(request, changePasswordSchema);

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) throw new HttpError(404, "Akun tidak ditemukan");

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new HttpError(401, "Password lama salah");

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: passwordHash } });

  return json({ ok: true });
});
