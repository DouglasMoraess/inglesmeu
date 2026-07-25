"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Painel", eyebrow: "01" },
  { href: "/content", label: "Conteúdo", eyebrow: "02" },
  { href: "/import", label: "Importar", eyebrow: "03" },
  { href: "/exercises", label: "Exercícios", eyebrow: "04" },
  { href: "/flashcards", label: "Flashcards", eyebrow: "05" },
  { href: "/review", label: "Revisão", eyebrow: "06" },
  { href: "/conversation", label: "Conversação", eyebrow: "07" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-baseline gap-2 focus-ring rounded">
          <span className="font-display text-xl font-semibold text-amber">Meu</span>
          <span className="font-display text-xl font-semibold">Inglês</span>
        </Link>

        <nav className="hidden gap-1 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring rounded px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-ink-800 text-amber-light"
                    : "text-paper-200/70 hover:bg-ink-800 hover:text-paper-100"
                )}
              >
                <span className="mr-1.5 font-mono text-xs text-amber-dark">{link.eyebrow}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="focus-ring rounded p-2 text-paper-100 md:hidden"
          aria-label="Abrir menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink-700 px-4 py-3 md:hidden">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "focus-ring rounded px-3 py-2 text-sm",
                  active ? "bg-ink-800 text-amber-light" : "text-paper-200/70"
                )}
              >
                <span className="mr-1.5 font-mono text-xs text-amber-dark">{link.eyebrow}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
