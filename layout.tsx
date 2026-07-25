"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContentForm from "@/components/ContentForm";
import ContentList from "@/components/ContentList";
import { getContentItems } from "@/lib/storage";
import { ContentItem } from "@/lib/types";

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    setItems(getContentItems());
  }, []);

  return (
    <div className="margin-rule pl-6">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-dark">Conteúdo</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
        Adicione o que você estudou
      </h1>
      <p className="mt-2 max-w-xl text-sm text-paper-200/70">
        Palavras, frases ou textos completos — tudo vira material de prática automaticamente
        nas outras seções do app.
      </p>

      <div className="mt-6">
        <Link
          href="/import"
          className="focus-ring mb-6 flex items-center justify-between rounded border border-dashed border-amber-dark/60 bg-amber/5 p-4 text-sm hover:bg-amber/10"
        >
          <span>
            📄 Prefere subir um <strong>PDF, DOCX ou TXT</strong> e deixar o app extrair e
            traduzir tudo automaticamente?
          </span>
          <span className="text-amber">Importar arquivo →</span>
        </Link>
        <ContentForm onAdded={setItems} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold">
          Seu material ({items.length})
        </h2>
        <ContentList items={items} onChange={setItems} />
      </div>
    </div>
  );
}
