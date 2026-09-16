import { handler, json, parseBody, requireApiAdmin } from "@/lib/api";
import { quotaAdjustSchema } from "@/lib/validation";
import { adjustQuota } from "@/lib/quota";

type Context = { params: Promise<{ id: string }> };

export const POST = handler(async (request: Request, context: Context) => {
  await requireApiAdmin();
  const { id } = await context.params;
  const input = await parseBody(request, quotaAdjustSchema);

  const quota = await adjustQuota({
    clientId: id,
    type: input.type,
    amount: input.amount,
    description: input.description,
  });

  return json(quota);
});
