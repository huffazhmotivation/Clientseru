import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { handler, HttpError, json, requireApiSession } from "@/lib/api";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".zip", ".ai", ".psd"];

export const POST = handler(async (request) => {
  await requireApiSession();

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new HttpError(422, "File tidak ditemukan");
  if (file.size > MAX_SIZE) throw new HttpError(413, "Ukuran file melebihi 5 MB");

  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED.includes(extension)) throw new HttpError(415, `Format ${extension || "ini"} tidak didukung`);

  const fileName = `${randomUUID()}${extension}`;
  const target = path.join(process.cwd(), "public", "uploads", fileName);
  await writeFile(target, Buffer.from(await file.arrayBuffer()));

  return json({ url: `/uploads/${fileName}`, name: file.name });
});
