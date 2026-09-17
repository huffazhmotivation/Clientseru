import { Search, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireDesigner } from "@/lib/auth";
import { listClientsWithQuota } from "@/lib/quota";
import { EmptyState, PageHeader } from "@/components/ui";
import { ClientCard } from "@/components/dashboard/client-card";
import { ClientForm } from "@/components/client-form";

export const dynamic = "force-dynamic";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await requireDesigner();
  const { q } = await searchParams;
  const [clients, packages] = await Promise.all([
    listClientsWithQuota(session.userId),
    prisma.package.findMany({ where: { designerId: session.userId }, orderBy: { quota: "asc" } }),
  ]);

  const query = (q ?? "").trim().toLowerCase();
  const filtered = query
    ? clients.filter(
        (c) => c.company.toLowerCase().includes(query) || c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query),
      )
    : clients;

  return (
    <>
      <PageHeader
        title="Clients"
        description="Kelola client, paket, dan sisa kuota desain mereka."
        action={<ClientForm packages={packages} />}
      />

      <form className="mb-6 max-w-sm" action="/clients">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari perusahaan, PIC, atau email…"
            className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-sm shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </form>

      {filtered.length === 0 ? (
        <EmptyState
          title={query ? "Tidak ada client yang cocok" : "Belum ada client"}
          hint={query ? "Coba kata kunci lain." : "Tambahkan client pertama untuk mulai mencatat kuota."}
          icon={Users}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              client={{
                id: client.id,
                company: client.company,
                name: client.name,
                active: client.active,
                packageName: client.package?.name,
                used: client.used,
                total: client.total,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
