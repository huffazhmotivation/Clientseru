import { prisma } from "@/lib/prisma";
import { HttpError, errorResponse, requireApiSession } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

/**
 * Menyajikan file yang disimpan lewat POST /api/upload. Perlu login (designer
 * atau client manapun yang sudah masuk) supaya file brief/hasil kerja tidak
 * bisa diakses publik lewat tebak-tebak id.
 */
export async function GET(_request: Request, context: Context) {
  try {
    await requireApiSession();

    const { id } = await context.params;
    const file = await prisma.uploadedFile.findUnique({ where: { id } });
    if (!file) throw new HttpError(404, "File tidak ditemukan");

    const bytes = Buffer.from(file.data, "base64");
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": file.mime,
        "Content-Disposition": `inline; filename="${encodeURIComponent(file.name)}"`,
        "Cache-Control": "private, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
