"use client";

import { useEffect, useState } from "react";
import ReviewPanel from "@/components/ReviewPanel";
import { getContentItems } from "@/lib/storage";
import { ContentItem } from "@/lib/types";

export default function ReviewPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    setItems(getContentItems());
  }, []);

  return (
    <div className="margin-rule pl-6">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-dark">Revisão</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
        Revisão espaçada
      </h1>
      <p className="mt-2 max-w-xl text-sm text-paper-200/70">
        Sistema estilo Anki: quanto mais fácil for lembrar, mais tempo até a próxima revisão.
      </p>

      <div className="mt-8">
        <ReviewPanel items={items} onChange={setItems} />
      </div>
    </div>
  );
}
