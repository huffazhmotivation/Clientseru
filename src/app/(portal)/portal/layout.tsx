import { LayoutGrid, FolderKanban, Images, Settings } from "lucide-react";
import { requireClient } from "@/lib/auth";
import { Sidebar, type NavItem } from "@/components/sidebar";

const iconClass = "h-4 w-4";

const NAV: NavItem[] = [
  { href: "/portal", label: "Ringkasan", icon: <LayoutGrid className={iconClass} strokeWidth={2} />, exact: true },
  { href: "/portal/requests", label: "Request desain", icon: <FolderKanban className={iconClass} strokeWidth={2} /> },
  { href: "/portal/gallery", label: "Galeri", icon: <Images className={iconClass} strokeWidth={2} /> },
  { href: "/portal/settings", label: "Pengaturan", icon: <Settings className={iconClass} strokeWidth={2} /> },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireClient();

  return (
    <div className="min-h-screen">
      <Sidebar items={NAV} userName={session.name} roleLabel="Client Portal" />
      <main className="mx-auto max-w-5xl px-5 py-8 md:pl-[292px] md:pr-8 md:py-10">{children}</main>
    </div>
  );
}
