"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { send } from "@/lib/client-api";

export type NavItem = { href: string; label: string; exact?: boolean };

export function Sidebar({
  items,
  userName,
  roleLabel,
}: {
  items: NavItem[];
  userName: string;
  roleLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  async function logout() {
    await send("/api/auth/logout", "POST");
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="border-line md:fixed md:inset-y-0 md:left-0 md:flex md:w-[228px] md:flex-col md:border-r">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 md:block md:border-b-0 md:py-5">
        <div>
          <p className="text-sm font-semibold tracking-tight text-ink">Kuota Desain</p>
          <p className="text-xs text-muted">{roleLabel}</p>
        </div>
        <button onClick={logout} className="text-xs text-muted hover:text-ink md:hidden">
          Keluar
        </button>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 md:flex-col md:overflow-visible md:border-b-0 md:px-3 md:py-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded px-2.5 py-1.5 text-sm transition-colors ${
              isActive(item) ? "bg-wash font-medium text-ink" : "text-muted hover:bg-wash hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto hidden border-t border-line px-4 py-3 md:block">
        <p className="truncate text-sm text-ink">{userName}</p>
        <button onClick={logout} className="mt-1 text-xs text-muted hover:text-ink">
          Keluar
        </button>
      </div>
    </aside>
  );
}
