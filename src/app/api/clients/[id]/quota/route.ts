import { handler, json, parseBody, requireApiAdmin } from "@/lib/api";
import { quotaAdjustSchema } from "@/lib/validation";
import { adjustQuota, requireOwnedClient } from "@/lib/quota";

type Context = { params: Promise<{ id: string }> };

export const POST = handler(async (request: Request, context: Context) => {
  const session = await requireApiAdmin();
  const { id } = await context.params;
  const input = await parseBody(request, quotaAdjustSchema);

  await requireOwnedClient(session.userId, id);

  const quota = await adjustQuota({
    clientId: id,
    type: input.type,
    amount: input.amount,
    description: input.description,
  });

  return json(quota);
});
