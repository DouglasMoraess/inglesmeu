"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { getContentItems, getStudyStreak } from "@/lib/storage";
import { getDueItems } from "@/lib/srs";
import { ContentItem } from "@/lib/types";
import { formatDateBR } from "@/lib/utils";

export default function DashboardPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setItems(getContentItems());
    setStreak(getStudyStreak());
  }, []);

  const dueCount = useMemo(() => getDueItems(items).length, [items]);

  const totalReviews = items.reduce((acc, i) => acc + i.timesReviewed, 0);
  const totalCorrect = items.reduce((acc, i) => acc + i.timesCorrect, 0);
  const accuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  const boxCounts = [1, 2, 3, 4, 5].map(
    (box) => items.filter((i) => i.box === box).length
  );
  const maxBoxCount = Math.max(1, ...boxCounts);

  const recent = items.slice(0, 5);

  return (
    <div className="margin-rule pl-6">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-dark">Painel</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
        Seu caderno de estudos
      </h1>
      <p className="mt-2 max-w-xl text-sm text-paper-200/70">
        Acompanhe seu progresso e mantenha o hábito diário. Cada palavra ou frase que você
        adiciona vira prática automática.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard eyebrow="Vocabulário" label="itens salvos" value={items.length} />
        <StatCard eyebrow="Sequência" label="dias seguidos estudando" value={streak} />
        <StatCard eyebrow="Revisão" label="itens para revisar hoje" value={dueCount} />
        <StatCard eyebrow="Acerto" label="taxa de acerto geral" value={`${accuracy}%`} />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card-notebook p-5">
          <h2 className="font-display text-lg font-semibold">Distribuição por caixa (SRS)</h2>
          <p className="mt-1 text-xs text-paper-200/60">
            Caixa 1 = recém-adicionado · Caixa 5 = bem consolidado
          </p>
          <div className="mt-4 flex h-32 items-end gap-3">
            {boxCounts.map((count, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-amber/80"
                  style={{ height: `${(count / maxBoxCount) * 100}%`, minHeight: count > 0 ? 4 : 0 }}
                />
                <span className="font-mono text-xs text-paper-200/60">{idx + 1}</span>
                <span className="font-mono text-xs text-paper-100">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-notebook p-5">
          <h2 className="font-display text-lg font-semibold">Adicionados recentemente</h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-paper-200/60">
              Nada por aqui ainda.{" "}
              <Link href="/content" className="text-amber underline focus-ring rounded">
                Adicione seu primeiro conteúdo
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {recent.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-paper-100">{item.en}</span>
                    <span className="ml-2 text-paper-200/50">{item.pt}</span>
                  </div>
                  <span className="font-mono text-xs text-paper-200/40">
                    {formatDateBR(item.dateAdded)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/content"
          className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
        >
          + Adicionar conteúdo
        </Link>
        <Link
          href="/review"
          className="focus-ring rounded border border-ink-600 px-4 py-2 text-sm font-medium hover:bg-ink-800"
        >
          Revisar agora ({dueCount})
        </Link>
        <Link
          href="/exercises"
          className="focus-ring rounded border border-ink-600 px-4 py-2 text-sm font-medium hover:bg-ink-800"
        >
          Praticar exercícios
        </Link>
      </div>
    </div>
  );
}
