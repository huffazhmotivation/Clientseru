import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast";
import { ThemeProvider } from "@/components/theme-provider";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

// maximumScale: 1 mencegah browser HP (terutama iOS Safari) otomatis zoom-in saat kolom input
// difokuskan, tanpa mengubah ukuran font/desain apa pun.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ClientSeru",
  description: "Platform kolaborasi desain antara studio dan client.",
};

// Runs before React hydrates so the saved theme applies before first paint —
// otherwise the page would flash dark (the default) then snap to light.
const THEME_INIT_SCRIPT = `
  try {
    var t = localStorage.getItem("clientseru-theme");
    if (t === "light") document.documentElement.classList.add("light");
  } catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans text-base">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
