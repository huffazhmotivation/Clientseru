import { requireClient } from "@/lib/auth";
import { Sidebar, type NavItem } from "@/components/sidebar";

const NAV: NavItem[] = [
  { href: "/portal", label: "Ringkasan", exact: true },
  { href: "/portal/requests", label: "Request desain" },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireClient();

  return (
    <div className="min-h-screen">
      <Sidebar items={NAV} userName={session.name} roleLabel="Client" />
      <main className="mx-auto max-w-[1280px] px-5 py-8 md:pl-[292px] md:pr-8 md:py-10">{children}</main>
    </div>
  );
}
