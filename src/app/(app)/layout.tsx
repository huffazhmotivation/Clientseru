import { requireAdmin } from "@/lib/auth";
import { Sidebar, type NavItem } from "@/components/sidebar";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/requests", label: "Requests" },
  { href: "/history", label: "Riwayat kuota" },
  { href: "/settings", label: "Pengaturan" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen">
      <Sidebar items={NAV} userName={session.name} roleLabel="Designer" />
      <main className="mx-auto max-w-[1280px] px-5 py-8 md:pl-[292px] md:pr-8 md:py-10">{children}</main>
    </div>
  );
}
