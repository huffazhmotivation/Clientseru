import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import { handler, HttpError, json, parseBody } from "@/lib/api";
import { registerSchema } from "@/lib/validation";

/**
 * Register publik — HANYA untuk role DESIGNER.
 * Client tidak pernah mendaftar lewat sini; akun client dibuat lewat undangan (/invite/[token]).
 */
export const POST = handler(async (request) => {
  const input = await parseBody(request, registerSchema);
  const email = input.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "Email sudah terdaftar, silakan login");

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      password: passwordHash,
      role: "DESIGNER",
    },
  });

  await setSessionCookie({
    userId: user.id,
    name: user.name,
    role: user.role,
    clientId: user.clientId,
  });

  return json({ redirectTo: "/dashboard" }, 201);
});
