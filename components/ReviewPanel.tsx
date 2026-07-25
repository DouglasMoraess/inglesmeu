"use client";

import { useMemo, useState } from "react";
import { ContentItem, Difficulty } from "@/lib/types";
import { applyReview, getDueItems } from "@/lib/srs";
import { updateContentItem } from "@/lib/storage";
import SpeakButton from "@/components/SpeakButton";
import PronunciationPractice from "@/components/PronunciationPractice";

interface ReviewPanelProps {
  items: ContentItem[];
  onChange: (items: ContentItem[]) => void;
}

export default function ReviewPanel({ items, onChange }: ReviewPanelProps) {
  const dueItems = useMemo(() => getDueItems(items), [items]);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  if (dueItems.length === 0) {
    return (
      <div className="card-notebook p-6 text-center">
        <p className="font-display text-xl">Tudo em dia! 🎉</p>
        <p className="mt-2 text-sm text-paper-200/70">
          Você não tem nenhum item para revisar agora. Volte mais tarde ou adicione mais
          conteúdo.
        </p>
        {reviewedCount > 0 && (
          <p className="mt-4 text-xs text-teal">{reviewedCount} item(ns) revisado(s) agora.</p>
        )}
      </div>
    );
  }

  const card = dueItems[0];

  function handleDifficulty(diff: Difficulty) {
    const updated = applyReview(card, diff);
    const allUpdated = updateContentItem(updated);
    onChange(allUpdated);
    setFlipped(false);
    setReviewedCount((c) => c + 1);
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-3 text-center font-mono text-xs text-paper-200/50">
        {dueItems.length} item(ns) restantes para revisar
      </p>

      <div className="card-notebook p-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-wider text-amber-dark">
          Caixa {card.box}
        </span>
        <p className="mt-3 font-display text-2xl">{card.en}</p>
        {flipped && <p className="mt-2 text-paper-200/70">{card.pt}</p>}

        <div className="mt-4 flex flex-col items-center gap-3">
          <SpeakButton text={card.en} />
          <PronunciationPractice targetText={card.en} />
        </div>

        {!flipped ? (
          <button
            onClick={() => setFlipped(true)}
            className="focus-ring mt-6 rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
          >
            Mostrar tradução
          </button>
        ) : (
          <div className="mt-6 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDifficulty("dificil")}
              className="focus-ring rounded border border-coral/50 py-2 text-sm text-coral hover:bg-coral/10"
            >
              Difícil
            </button>
            <button
              onClick={() => handleDifficulty("medio")}
              className="focus-ring rounded border border-amber/50 py-2 text-sm text-amber hover:bg-amber/10"
            >
              Médio
            </button>
            <button
              onClick={() => handleDifficulty("facil")}
              className="focus-ring rounded border border-teal/50 py-2 text-sm text-teal hover:bg-teal/10"
            >
              Fácil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
