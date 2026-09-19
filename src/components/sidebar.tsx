"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { send } from "@/lib/client-api";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme-toggle";

export type NavItem = { href: string; label: string; icon: ReactNode; exact?: boolean };

/** Small custom mark — two overlapping rounded facets, standing in for "review / focus". */
function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-[18px] w-[18px]" fill="none">
      <rect x="4" y="4" width="18" height="18" rx="6" fill="white" fillOpacity="0.9" />
      <rect x="10" y="10" width="18" height="18" rx="6" fill="white" fillOpacity="0.45" />
    </svg>
  );
}

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

  // Highlight menu langsung saat diklik (tanpa menunggu server merender halaman
  // tujuan), supaya UI terasa instan. Dilepas otomatis saat URL sudah berganti.
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);
  const current = pendingHref ?? pathname;

  const isActive = (item: NavItem) =>
    item.exact ? current === item.href : current === item.href || current.startsWith(`${item.href}/`);

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
    <aside className="glass md:fixed md:inset-y-0 md:left-0 md:m-3 md:flex md:h-[calc(100vh-1.5rem)] md:w-[252px] md:flex-col md:rounded-2xl md:border-edge/10 md:shadow-card">
      <div className="flex items-center justify-between border-b border-edge/10 px-4 py-3.5 md:block md:border-b-0 md:px-5 md:py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-glow">
            <Mark />
          </span>
          <span>
            <p className="font-sans text-[15px] font-semibold leading-none tracking-tight text-ink">ClientSeru</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-subtle">{roleLabel}</p>
          </span>
        </Link>
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button onClick={logout} className="text-xs font-medium text-muted hover:text-ink">
            Keluar
          </button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-b border-edge/10 px-3 py-2 no-scrollbar md:flex-col md:overflow-visible md:border-b-0 md:px-3 md:py-3">
        {items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              // prefetch penuh: data halaman diambil di belakang layar begitu menu terlihat,
              // jadi saat diklik langsung tampil dari cache router.
              prefetch
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                setPendingHref(item.href);
              }}
              className={cn(
                "group relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors md:shrink",
                active
                  ? "bg-brand-500/15 text-white shadow-glow before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-brand-gradient md:before:block before:hidden"
                  : "text-muted hover:bg-edge/10 hover:text-ink",
              )}
            >
              <span className={cn("shrink-0", active ? "text-brand-300" : "text-subtle group-hover:text-ink")}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden items-center gap-2 border-t border-edge/10 px-4 py-3.5 md:flex">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient-soft text-xs font-semibold text-brand-300">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{userName}</p>
        </div>
        <ThemeToggle />
        <button
          onClick={logout}
          className="shrink-0 rounded-md p-1.5 text-subtle transition-colors hover:bg-edge/10 hover:text-accentRose-500"
          aria-label="Keluar"
          title="Keluar"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
