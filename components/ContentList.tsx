"use client";

import { useMemo, useState } from "react";
import { ContentItem } from "@/lib/types";
import { deleteContentItem } from "@/lib/storage";
import SpeakButton from "@/components/SpeakButton";
import { formatDateBR } from "@/lib/utils";

interface ContentListProps {
  items: ContentItem[];
  onChange: (items: ContentItem[]) => void;
}

export default function ContentList({ items, onChange }: ContentListProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const typeMatch = filterType === "all" || item.type === filterType;
      const term = search.toLowerCase();
      const searchMatch =
        !term ||
        item.en.toLowerCase().includes(term) ||
        item.pt.toLowerCase().includes(term) ||
        item.lessonName.toLowerCase().includes(term);
      return typeMatch && searchMatch;
    });
  }, [items, filterType, search]);

  function handleDelete(id: string) {
    const updated = deleteContentItem(id);
    onChange(updated);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por palavra, tradução ou aula..."
          className="focus-ring min-w-[200px] flex-1 rounded border border-ink-600 bg-ink-900 p-2 text-sm outline-none"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="focus-ring rounded border border-ink-600 bg-ink-900 p-2 text-sm outline-none"
        >
          <option value="all">Todos os tipos</option>
          <option value="word">Palavras</option>
          <option value="phrase">Frases</option>
          <option value="text">Textos</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-paper-200/60">Nenhum conteúdo encontrado.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li key={item.id} className="card-notebook p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-dark">
                    {item.type === "word" ? "Palavra" : item.type === "phrase" ? "Frase" : "Texto"} ·{" "}
                    {item.lessonName}
                  </span>
                  <p className="mt-1 text-paper-100">{item.en}</p>
                  <p className="text-sm text-paper-200/60">{item.pt}</p>
                  {item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-ink-700 px-2 py-0.5 text-[10px] text-paper-200/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="font-mono text-[10px] text-paper-200/40">
                    {formatDateBR(item.dateAdded)}
                  </span>
                  <SpeakButton text={item.en} />
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="focus-ring rounded px-2 py-1 text-xs text-coral hover:bg-ink-800"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
