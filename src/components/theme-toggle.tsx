"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/cn";

/** Small, outline-icon-only toggle. Icon and label flip to reflect the theme
 * you'd switch *to*, not the current one — the common convention. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-subtle transition-colors hover:bg-edge/10 hover:text-ink",
        className,
      )}
    >
      {isDark ? <Sun className="h-4 w-4" strokeWidth={1.75} /> : <Moon className="h-4 w-4" strokeWidth={1.75} />}
    </button>
  );
}
