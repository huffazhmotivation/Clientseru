import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, parseBody, requireApiAdmin } from "@/lib/api";
import { packageSchema } from "@/lib/validation";

export const GET = handler(async () => {
  const session = await requireApiAdmin();
  return json(
    await prisma.package.findMany({ where: { designerId: session.userId }, orderBy: { quota: "asc" } }),
  );
});

export const POST = handler(async (request) => {
  const session = await requireApiAdmin();
  const input = await parseBody(request, packageSchema);

  try {
    const created = await prisma.package.create({
      data: {
        name: input.name,
        quota: input.quota,
        price: input.price ?? 0,
        note: input.note || null,
        designerId: session.userId,
      },
    });
    return json(created, 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new HttpError(409, "Kamu sudah punya paket dengan nama itu");
    }
    throw error;
  }
});
