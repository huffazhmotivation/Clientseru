import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Kuota Desain",
  description: "Platform kolaborasi desain antara studio dan client.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={sans.variable}>
      <body className="font-sans text-base">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
