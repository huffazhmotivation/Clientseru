import { LayoutDashboard, Users, ListChecks, History, Settings } from "lucide-react";
import { requireDesigner } from "@/lib/auth";
import { Sidebar, type NavItem } from "@/components/sidebar";

const iconClass = "h-4 w-4";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className={iconClass} strokeWidth={2} />, exact: true },
  { href: "/clients", label: "Clients", icon: <Users className={iconClass} strokeWidth={2} /> },
  { href: "/requests", label: "Requests", icon: <ListChecks className={iconClass} strokeWidth={2} /> },
  { href: "/history", label: "Riwayat kuota", icon: <History className={iconClass} strokeWidth={2} /> },
  { href: "/settings", label: "Pengaturan", icon: <Settings className={iconClass} strokeWidth={2} /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireDesigner();

  return (
    <div className="min-h-screen">
      <Sidebar items={NAV} userName={session.name} roleLabel="Designer Studio" />
      <main className="mx-auto max-w-6xl px-5 py-8 md:pl-[292px] md:pr-8 md:py-10">{children}</main>
    </div>
  );
}
