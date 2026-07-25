import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
});

export const metadata: Metadata = {
  title: "Meu Inglês — Caderno de Estudos",
  description: "Estude inglês do seu jeito: adicione conteúdo e pratique automaticamente.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${fraunces.variable} ${inter.variable} ${jbmono.variable} font-body bg-ink-950 bg-grid-lines bg-grid min-h-screen text-paper-100`}
      >
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:px-8">{children}</main>
      </body>
    </html>
  );
}
