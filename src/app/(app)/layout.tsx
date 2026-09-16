import { LayoutDashboard, Users, ListChecks, History, Settings } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { Sidebar, type NavItem } from "@/components/sidebar";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/requests", label: "Requests", icon: ListChecks },
  { href: "/history", label: "Riwayat kuota", icon: History },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar items={NAV} userName={session.name} roleLabel="Designer Studio" />
      <main className="mx-auto max-w-6xl px-5 py-8 md:pl-[288px] md:pr-8 md:py-10">{children}</main>
    </div>
  );
}
