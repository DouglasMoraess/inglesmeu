"use client";

import { useState } from "react";
import { addContentItem, generateId } from "@/lib/storage";
import { ContentItem, ContentType } from "@/lib/types";

interface ContentFormProps {
  onAdded: (items: ContentItem[]) => void;
}

const TODAY_KEY = () => new Date().toISOString().slice(0, 10);

export default function ContentForm({ onAdded }: ContentFormProps) {
  const [type, setType] = useState<ContentType>("word");
  const [en, setEn] = useState("");
  const [pt, setPt] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!en.trim() || !pt.trim()) {
      setError("Preencha o texto em inglês e a tradução em português.");
      return;
    }
    setError("");

    const item: ContentItem = {
      id: generateId(),
      type,
      en: en.trim(),
      pt: pt.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      lessonName: lessonName.trim() || "Sem aula",
      dateAdded: new Date().toISOString(),
      box: 1,
      nextReview: TODAY_KEY(),
      lastReviewed: null,
      timesReviewed: 0,
      timesCorrect: 0,
    };

    const updated = addContentItem(item);
    onAdded(updated);
    setEn("");
    setPt("");
    setTags("");
  }

  return (
    <form onSubmit={handleSubmit} className="card-notebook space-y-4 p-5">
      <div className="flex flex-wrap gap-2">
        {(["word", "phrase", "text"] as ContentType[]).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setType(t)}
            className={`focus-ring rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              type === t ? "bg-amber text-ink-950" : "border border-ink-600 text-paper-200/70"
            }`}
          >
            {t === "word" ? "Palavra" : t === "phrase" ? "Frase" : "Texto"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-paper-200/70">Em inglês</span>
          <textarea
            value={en}
            onChange={(e) => setEn(e.target.value)}
            rows={type === "text" ? 5 : 2}
            placeholder="Ex: I have been studying English for two years."
            className="focus-ring w-full rounded border border-ink-600 bg-ink-900 p-2.5 text-sm text-paper-100 outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-paper-200/70">Tradução em português</span>
          <textarea
            value={pt}
            onChange={(e) => setPt(e.target.value)}
            rows={type === "text" ? 5 : 2}
            placeholder="Ex: Eu estudo inglês há dois anos."
            className="focus-ring w-full rounded border border-ink-600 bg-ink-900 p-2.5 text-sm text-paper-100 outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-paper-200/70">Nome da aula / data (opcional)</span>
          <input
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            placeholder="Ex: Aula 12 - Present Perfect"
            className="focus-ring w-full rounded border border-ink-600 bg-ink-900 p-2.5 text-sm text-paper-100 outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-paper-200/70">Tags (separadas por vírgula)</span>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Ex: verbos, viagem"
            className="focus-ring w-full rounded border border-ink-600 bg-ink-900 p-2.5 text-sm text-paper-100 outline-none"
          />
        </label>
      </div>

      {error && <p className="text-sm text-coral">{error}</p>}

      <button
        type="submit"
        className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
      >
        Salvar conteúdo
      </button>
    </form>
  );
}
