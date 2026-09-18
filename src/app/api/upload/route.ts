import path from "node:path";
import { prisma } from "@/lib/prisma";
import { handler, HttpError, json, requireApiSession } from "@/lib/api";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".zip", ".ai", ".psd"];
const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".zip": "application/zip",
  ".ai": "application/postscript",
  ".psd": "image/vnd.adobe.photoshop",
};

/**
 * PENTING: Vercel serverless functions berjalan di filesystem read-only & ephemeral
 * (tiap invocation bisa dapat instance baru). Menulis ke folder `public/uploads`
 * seperti sebelumnya SELALU gagal di production (hanya kebetulan jalan di lokal).
 * Jadi file disimpan sebagai base64 di tabel `UploadedFile`, dan disajikan lewat
 * GET /api/files/[id] (bukan dikembalikan sebagai data: URL langsung, karena
 * Chrome memblokir navigasi tab baru / target="_blank" ke data: URL).
 */
export const POST = handler(async (request) => {
  await requireApiSession();

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new HttpError(422, "File tidak ditemukan");
  if (file.size > MAX_SIZE) throw new HttpError(413, "Ukuran file melebihi 5 MB");

  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED.includes(extension)) throw new HttpError(415, `Format ${extension || "ini"} tidak didukung`);

  const mime = file.type || MIME_BY_EXT[extension] || "application/octet-stream";
  const data = Buffer.from(await file.arrayBuffer()).toString("base64");

  const saved = await prisma.uploadedFile.create({
    data: { name: file.name, mime, data },
    select: { id: true, name: true },
  });

  return json({ url: `/api/files/${saved.id}`, name: saved.name });
});
