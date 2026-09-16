import { prisma } from "@/lib/prisma";
import { handler, json, parseBody, requireApiAdmin } from "@/lib/api";
import { packageSchema } from "@/lib/validation";

export const GET = handler(async () => {
  await requireApiAdmin();
  return json(await prisma.package.findMany({ orderBy: { quota: "asc" } }));
});

export const POST = handler(async (request) => {
  await requireApiAdmin();
  const input = await parseBody(request, packageSchema);

  const created = await prisma.package.create({
    data: {
      name: input.name,
      quota: input.quota,
      price: input.price ?? 0,
      note: input.note || null,
    },
  });

  return json(created, 201);
});
