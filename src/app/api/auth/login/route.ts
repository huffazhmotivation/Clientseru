import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";
import { handler, HttpError, json, parseBody } from "@/lib/api";
import { loginSchema } from "@/lib/validation";

export const POST = handler(async (request) => {
  const { email, password } = await parseBody(request, loginSchema);

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(401, "Email atau password salah");
  }

  await setSessionCookie({
    userId: user.id,
    name: user.name,
    role: user.role,
    clientId: user.clientId,
  });

  return json({ redirectTo: user.role === "ADMIN" ? "/dashboard" : "/portal" });
});
