/**
 * Bikin/update akun designer (ADMIN) baru.
 *
 * Pemakaian:
 *   npm run create-admin -- "Nama Designer" designer@studio.com passwordRahasia
 *
 * Kalau email sudah ada, password & nama akun tsb akan di-update (bukan bikin duplikat).
 * Ini terpisah dari prisma/seed.ts supaya bisa dipakai kapan saja tanpa
 * menjalankan ulang data demo (client contoh, dsb).
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [name, emailRaw, password] = process.argv.slice(2);

  if (!name || !emailRaw || !password) {
    console.error(
      "Pemakaian: npm run create-admin -- \"Nama Designer\" designer@studio.com passwordRahasia",
    );
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("Password minimal 6 karakter.");
    process.exit(1);
  }

  const email = emailRaw.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.role === "CLIENT") {
    console.error(`Email ${email} sudah dipakai akun CLIENT. Pakai email lain untuk akun designer.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, password: passwordHash },
    create: { name, email, password: passwordHash, role: "ADMIN" },
  });

  console.log(`Akun designer siap: ${user.email} (role: ${user.role}).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
