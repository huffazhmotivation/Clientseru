"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { send } from "@/lib/client-api";
import { cn } from "@/lib/cn";

export type NavItem = { href: string; label: string; icon: ReactNode; exact?: boolean };

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

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <aside className="border-line bg-surface md:fixed md:inset-y-0 md:left-0 md:flex md:w-[248px] md:flex-col md:border-r">
      <div className="flex items-center justify-between border-b border-line-soft px-4 py-3.5 md:block md:border-b-0 md:px-5 md:py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-glow">
            <Sparkles className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span>
            <p className="text-sm font-semibold leading-none tracking-tight text-ink">Kuota Desain</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-subtle">{roleLabel}</p>
          </span>
        </Link>
        <button onClick={logout} className="text-xs font-medium text-muted hover:text-ink md:hidden">
          Keluar
        </button>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-b border-line-soft px-3 py-2 no-scrollbar md:flex-col md:overflow-visible md:border-b-0 md:px-3 md:py-3">
        {items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors md:shrink",
                active ? "bg-brand-50 text-brand-700" : "text-muted hover:bg-wash hover:text-ink",
              )}
            >
              <span className={cn("shrink-0", active ? "text-brand-600" : "text-subtle group-hover:text-ink")}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden items-center gap-2.5 border-t border-line-soft px-4 py-3.5 md:flex">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-wash text-xs font-semibold text-ink">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{userName}</p>
        </div>
        <button
          onClick={logout}
          className="shrink-0 rounded-md p-1.5 text-subtle transition-colors hover:bg-wash hover:text-accentRose-600"
          aria-label="Keluar"
          title="Keluar"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
