import { setSessionCookie } from "@/lib/auth";
import { handler, json, parseBody } from "@/lib/api";
import { invitationActivateSchema } from "@/lib/validation";
import { activateInvitation, getValidInvitation } from "@/lib/invite";

type Context = { params: Promise<{ token: string }> };

/** Publik — dibuka client dari link undangan, tanpa perlu login. */
export const GET = handler(async (_request: Request, context: Context) => {
  const { token } = await context.params;
  const invitation = await getValidInvitation(token);

  return json({
    name: invitation.name,
    email: invitation.email,
    company: invitation.client.company,
    designerName: invitation.client.designer.name,
  });
});

/** Publik — client mengirim password pilihannya sendiri untuk mengaktifkan akun. */
export const POST = handler(async (request: Request, context: Context) => {
  const { token } = await context.params;
  const input = await parseBody(request, invitationActivateSchema);

  const user = await activateInvitation(token, input.password);

  await setSessionCookie({
    userId: user.id,
    name: user.name,
    role: user.role,
    clientId: user.clientId,
  });

  return json({ redirectTo: "/portal" });
});
