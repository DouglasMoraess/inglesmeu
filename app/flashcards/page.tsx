"use client";

import { useEffect, useState } from "react";
import FlashcardView from "@/components/FlashcardView";
import { getContentItems } from "@/lib/storage";
import { ContentItem } from "@/lib/types";

export default function FlashcardsPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    setItems(getContentItems());
  }, []);

  return (
    <div className="margin-rule pl-6">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-dark">Flashcards</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">Modo flashcard</h1>
      <p className="mt-2 max-w-xl text-sm text-paper-200/70">
        Toque no cartão para ver a tradução e avalie o quanto você lembrou.
      </p>

      <div className="mt-8">
        <FlashcardView items={items} />
      </div>
    </div>
  );
}
