"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm animate-fade-in md:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass-strong w-full max-w-lg animate-scale-in rounded-xl shadow-popover"
      >
        <div className="flex items-center justify-between border-b border-edge/10 px-5 py-4">
          <h2 className="font-sans text-base font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-subtle transition-colors hover:bg-edge/10 hover:text-ink"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
