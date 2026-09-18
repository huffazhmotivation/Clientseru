import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Kuota Desain",
  description: "Platform kolaborasi desain antara studio dan client.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans text-base">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
