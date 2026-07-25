"use client";

import { useEffect, useState } from "react";
import ExercisePanel from "@/components/ExercisePanel";
import { getContentItems } from "@/lib/storage";
import { ContentItem } from "@/lib/types";

export default function ExercisesPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    setItems(getContentItems());
  }, []);

  return (
    <div className="margin-rule pl-6">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-dark">Exercícios</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
        Pratique automaticamente
      </h1>
      <p className="mt-2 max-w-xl text-sm text-paper-200/70">
        Os exercícios são gerados a partir do conteúdo que você já cadastrou.
      </p>

      <div className="mt-6">
        <ExercisePanel items={items} />
      </div>
    </div>
  );
}
