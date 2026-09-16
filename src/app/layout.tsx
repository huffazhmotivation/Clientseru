import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kuota Desain",
  description: "Pencatatan kuota dan request desain untuk client studio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans text-base">{children}</body>
    </html>
  );
}
