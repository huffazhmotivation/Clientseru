import { LayoutGrid, FolderKanban } from "lucide-react";
import { requireClient } from "@/lib/auth";
import { Sidebar, type NavItem } from "@/components/sidebar";

const NAV: NavItem[] = [
  { href: "/portal", label: "Ringkasan", icon: LayoutGrid, exact: true },
  { href: "/portal/requests", label: "Request desain", icon: FolderKanban },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireClient();

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar items={NAV} userName={session.name} roleLabel="Client Portal" />
      <main className="mx-auto max-w-5xl px-5 py-8 md:pl-[288px] md:pr-8 md:py-10">{children}</main>
    </div>
  );
}
