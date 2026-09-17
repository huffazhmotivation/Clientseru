import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "designer@studio.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "designer123";

async function main() {
  const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { name: "Designer", email: ADMIN_EMAIL, password: adminPassword, role: "DESIGNER" },
  });

  const monthly = await prisma.package.upsert({
    where: { designerId_name: { designerId: admin.id, name: "Monthly Design 30" } },
    update: {},
    create: { name: "Monthly Design 30", quota: 30, price: 3_500_000, designerId: admin.id },
  });

  const business = await prisma.package.upsert({
    where: { designerId_name: { designerId: admin.id, name: "Business 50" } },
    update: {},
    create: { name: "Business 50", quota: 50, price: 5_500_000, designerId: admin.id },
  });

  const demo = [
    { company: "PT ABC", name: "Budi Santoso", email: "abc@client.com", pkg: monthly, total: 30, used: 12 },
    { company: "PT XYZ", name: "Sinta Dewi", email: "xyz@client.com", pkg: business, total: 50, used: 8 },
  ];

  for (const item of demo) {
    const existing = await prisma.client.findUnique({ where: { email: item.email } });
    if (existing) continue;

    const client = await prisma.client.create({
      data: {
        name: item.name,
        company: item.company,
        email: item.email,
        packageId: item.pkg.id,
        designerId: admin.id,
        quota: { create: { totalQuota: item.total, usedQuota: item.used } },
      },
    });

    await prisma.user.create({
      data: {
        name: item.name,
        email: item.email,
        password: await bcrypt.hash("client123", 10),
        role: "CLIENT",
        clientId: client.id,
      },
    });

    await prisma.quotaHistory.createMany({
      data: [
        {
          clientId: client.id,
          type: "TOPUP",
          amount: item.total,
          description: `Kuota awal paket ${item.pkg.name}`,
        },
        {
          clientId: client.id,
          type: "USAGE",
          amount: -item.used,
          description: "Pemakaian periode berjalan",
        },
      ],
    });

    await prisma.designRequest.createMany({
      data: [
        { clientId: client.id, title: "Banner promo", description: "Ukuran 1080x1080", status: "WORKING" },
        { clientId: client.id, title: "Instagram feed", description: "3 slide carousel", status: "PENDING" },
      ],
    });
  }

  console.log(`Seed selesai. Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}. Client: abc@client.com / client123`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
