"use client";

import { useState } from "react";
import { ContentItem, Difficulty } from "@/lib/types";
import { applyReview } from "@/lib/srs";
import { updateContentItem } from "@/lib/storage";
import SpeakButton from "@/components/SpeakButton";

interface FlashcardViewProps {
  items: ContentItem[];
}

export default function FlashcardView({ items }: FlashcardViewProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (items.length === 0) {
    return (
      <p className="card-notebook p-5 text-sm text-paper-200/70">
        Nenhum conteúdo cadastrado ainda. Vá até <span className="text-amber">Conteúdo</span> e
        adicione palavras ou frases.
      </p>
    );
  }

  const card = items[index % items.length];

  function goNext() {
    setFlipped(false);
    setIndex((i) => (i + 1) % items.length);
  }

  function handleDifficulty(diff: Difficulty) {
    const updated = applyReview(card, diff);
    updateContentItem(updated);
    goNext();
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-3 text-center font-mono text-xs text-paper-200/50">
        Cartão {(index % items.length) + 1} de {items.length}
      </p>

      <div
        className={`flip-card h-56 cursor-pointer ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="flip-card-inner h-full w-full">
          <div className="flip-card-front card-notebook flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-dark">
              Inglês
            </span>
            <p className="font-display text-2xl">{card.en}</p>
            <p className="text-xs text-paper-200/40">Toque para virar</p>
          </div>
          <div className="flip-card-back card-notebook flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-dark">
              Português
            </span>
            <p className="font-display text-2xl">{card.pt}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
        <SpeakButton text={card.en} />
      </div>

      {flipped && (
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

      {!flipped && (
        <button
          onClick={goNext}
          className="focus-ring mt-6 block w-full rounded border border-ink-600 py-2 text-center text-sm text-paper-200/70 hover:bg-ink-800"
        >
          Pular
        </button>
      )}
    </div>
  );
}
