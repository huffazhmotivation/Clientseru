import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import { getSession, type Session } from "./auth";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    const first = error.issues[0];
    return NextResponse.json(
      { error: first ? `${first.path.join(".")}: ${first.message}` : "Data tidak valid" },
      { status: 422 },
    );
  }
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
}

/** Bungkus handler route supaya error tertangani di satu tempat. */
export function handler<Args extends unknown[]>(
  fn: (request: Request, ...args: Args) => Promise<Response>,
) {
  return async (request: Request, ...args: Args): Promise<Response> => {
    try {
      return await fn(request, ...args);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export async function parseBody<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new HttpError(400, "Body request bukan JSON yang valid");
  }
  return schema.parse(raw);
}

export async function requireApiSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new HttpError(401, "Silakan login terlebih dahulu");
  return session;
}

export async function requireApiDesigner(): Promise<Session> {
  const session = await requireApiSession();
  if (session.role !== "DESIGNER") throw new HttpError(403, "Akses khusus designer");
  return session;
}
