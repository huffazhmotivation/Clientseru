import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const clientSchema = z.object({
  name: z.string().min(2, "Nama PIC minimal 2 karakter").max(80),
  company: z.string().min(2, "Nama perusahaan minimal 2 karakter").max(120),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().max(30).optional().or(z.literal("")),
  packageId: z.string().optional().or(z.literal("")),
  totalQuota: z.coerce.number().int().min(0, "Kuota tidak boleh negatif").max(100000),
  note: z.string().max(500).optional().or(z.literal("")),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
});

export const clientUpdateSchema = clientSchema.partial();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak sama dengan password baru",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Password baru tidak boleh sama dengan password lama",
    path: ["newPassword"],
  });

export const packageSchema = z.object({
  name: z.string().min(2, "Nama paket minimal 2 karakter").max(80),
  quota: z.coerce.number().int().min(1, "Kuota minimal 1").max(100000),
  price: z.coerce.number().int().min(0).max(1_000_000_000).optional(),
  note: z.string().max(300).optional().or(z.literal("")),
});

export const quotaAdjustSchema = z.object({
  type: z.enum(["TOPUP", "ADJUST"]),
  amount: z.coerce.number().int().refine((v) => v !== 0, "Jumlah tidak boleh 0"),
  description: z.string().min(3, "Alasan wajib diisi").max(200),
});

export const requestCreateSchema = z.object({
  clientId: z.string().optional(),
  title: z.string().min(3, "Judul minimal 3 karakter").max(120),
  description: z.string().max(2000).optional().or(z.literal("")),
  quotaCost: z.coerce.number().int().min(1).max(50).default(1),
  briefUrl: z.string().max(300).optional().or(z.literal("")),
  referenceUrl: z.string().max(300).optional().or(z.literal("")),
});

export const requestUpdateSchema = z.object({
  status: z.enum(["PENDING", "WORKING", "REVISION", "DONE", "CANCELLED"]).optional(),
  quotaCost: z.coerce.number().int().min(1).max(50).optional(),
  title: z.string().min(3).max(120).optional(),
  description: z.string().max(2000).optional(),
});

export const deliverableCreateSchema = z
  .object({
    type: z.enum(["FILE", "LINK"]),
    url: z.string().min(1, "URL wajib diisi").max(2000),
    name: z.string().min(1, "Nama wajib diisi").max(200),
  })
  .refine((data) => data.type !== "LINK" || /^https?:\/\//i.test(data.url), {
    message: "Link harus diawali http:// atau https://",
    path: ["url"],
  });

export type ClientInput = z.infer<typeof clientSchema>;
export type RequestCreateInput = z.infer<typeof requestCreateSchema>;
export type DeliverableCreateInput = z.infer<typeof deliverableCreateSchema>;
