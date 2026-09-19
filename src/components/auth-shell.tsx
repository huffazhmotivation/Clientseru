import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-[18px] w-[18px]" fill="none">
      <rect x="4" y="4" width="18" height="18" rx="6" fill="white" fillOpacity="0.9" />
      <rect x="10" y="10" width="18" height="18" rx="6" fill="white" fillOpacity="0.45" />
    </svg>
  );
}

export function AuthFeature({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-white/70">{desc}</p>
      </div>
    </div>
  );
}

/** Hero pane: dark moss-glass panel with floating light blobs, shown only on wide screens. */
export function AuthHero({ headline, description, children }: { headline: string; description: string; children?: ReactNode }) {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-gradient p-12 text-white lg:flex">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-clay-500/20 blur-2xl" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
          <Mark />
        </span>
        <span className="font-sans text-lg font-semibold tracking-tight">ClientSeru</span>
      </div>

      <div className="relative max-w-sm">
        <h2 className="font-sans text-3xl font-semibold leading-[1.15] tracking-tight">{headline}</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80">{description}</p>
        {children ? <div className="mt-10 space-y-4">{children}</div> : null}
      </div>

      <p className="relative text-xs text-white/60">© {new Date().getFullYear()} ClientSeru Studio</p>
    </div>
  );
}

export function AuthFormPane({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-glow">
            <Mark />
          </span>
          <span className="font-sans text-lg font-semibold tracking-tight text-ink">ClientSeru</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AuthShell({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {hero}
      <AuthFormPane>{children}</AuthFormPane>
    </main>
  );
}
