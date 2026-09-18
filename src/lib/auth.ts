import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * v2: nama cookie sengaja diganti supaya sesi lama (format role sebelum rename
 * ADMIN -> DESIGNER) otomatis dianggap tidak ada, bukan malah dianggap valid
 * dengan role yang sudah tidak dikenal (yang sebelumnya menyebabkan redirect
 * loop /dashboard <-> /portal).
 */
export const SESSION_COOKIE = "quota_session_v2";
const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari
const VALID_ROLES = ["DESIGNER", "CLIENT"] as const;

export type Session = {
  userId: string;
  name: string;
  role: "DESIGNER" | "CLIENT";
  clientId: string | null;
};

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function encodeSession(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  if (expected.length !== signature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    // Validasi bentuk & nilai role secara ketat. Sesi lama/format lama yang tidak cocok
    // dianggap tidak valid (null) supaya diarahkan ke /login, bukan nyasar ke redirect loop.
    if (
      !parsed ||
      typeof parsed.userId !== "string" ||
      typeof parsed.name !== "string" ||
      !VALID_ROLES.includes(parsed.role) ||
      (parsed.clientId !== null && typeof parsed.clientId !== "string")
    ) {
      return null;
    }
    return parsed as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(session: Session): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Dipakai di server component: wajib designer, kalau tidak dilempar ke login. */
export async function requireDesigner(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "DESIGNER") redirect("/portal");
  return session;
}

/** Dipakai di server component: wajib client. */
export async function requireClient(): Promise<Session & { clientId: string }> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "CLIENT" || !session.clientId) redirect("/dashboard");
  return { ...session, clientId: session.clientId };
}
