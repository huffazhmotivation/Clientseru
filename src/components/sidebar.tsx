"use client";

import Link from "next/link";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Plus, Settings, Users, ClipboardList, History, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { send } from "@/lib/client-api";

export type NavItem = { href: string; label: string; exact?: boolean };

const ICONS = [LayoutDashboard, Users, ClipboardList, History, Settings];

export function Sidebar({ items, userName, roleLabel }: { items: NavItem[]; userName: string; roleLabel: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isActive = (item: NavItem) => item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
  async function logout() { await send("/api/auth/logout", "POST"); router.replace("/login"); router.refresh(); }
  return <>
    <button className="fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink shadow-sm md:hidden" onClick={() => setOpen(!open)} aria-label="Buka navigasi"><Menu className="h-5 w-5" /></button>
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-[252px] -translate-x-full flex-col border-r border-line bg-white px-4 transition-transform md:translate-x-0 ${open ? "translate-x-0" : ""}`}>
      <div className="flex items-center gap-3 px-3 py-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-white">K</div><div><p className="font-display text-[15px] font-semibold tracking-tight text-ink">Kuota Desain</p><p className="text-xs text-muted">Workspace {roleLabel}</p></div></div>
      <div className="mb-5 rounded-xl bg-indigo-50 p-3"><div className="flex items-center justify-between text-xs"><span className="font-medium text-indigo-900">{roleLabel === "Client" ? "Paket aktif" : "Studio workspace"}</span><span className="text-indigo-500">•••</span></div><p className="mt-1 truncate text-sm font-semibold text-indigo-950">{roleLabel === "Client" ? "Creative partnership" : "Design operations"}</p></div>
      <nav className="space-y-1">{items.map((item, index) => { const Icon = ICONS[index] ?? LayoutDashboard; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive(item) ? "bg-indigo-50 font-semibold text-primary" : "text-muted hover:bg-wash hover:text-ink"}`}><Icon className="h-[18px] w-[18px]" />{item.label}{isActive(item) ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" /> : null}</Link>; })}</nav>
      <div className="mt-auto border-t border-line py-4"><div className="flex items-center gap-3 px-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-ink">{userName.slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-ink">{userName}</p><p className="text-xs text-muted">{roleLabel}</p></div><button className="text-muted hover:text-ink" aria-label="Notifikasi"><Bell className="h-4 w-4" /></button></div><button onClick={logout} className="mt-4 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-muted hover:bg-wash hover:text-ink"><LogOut className="h-3.5 w-3.5" />Keluar</button></div>
    </aside>
  </>;
}
