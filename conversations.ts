"use client";

import { useRef, useState } from "react";
import { detectFileType, extractTextFromFile, splitIntoStudyPhrases } from "@/lib/textExtract";
import { translateBatch } from "@/lib/translate";
import { addContentItem, generateId } from "@/lib/storage";
import { ContentItem } from "@/lib/types";

interface DraftItem {
  id: string;
  en: string;
  pt: string;
  include: boolean;
}

type Stage = "idle" | "reading" | "translating" | "review" | "saved";

const TODAY_KEY = () => new Date().toISOString().slice(0, 10);

export default function FileImportPanel() {
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [lessonName, setLessonName] = useState("");
  const [maxItems, setMaxItems] = useState(30);
  const [savedCount, setSavedCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setFileName(file.name);

    if (!detectFileType(file)) {
      setError("Formato não suportado. Envie um arquivo .pdf, .docx ou .txt.");
      return;
    }

    setStage("reading");
    let rawText = "";
    try {
      rawText = await extractTextFromFile(file);
    } catch (e) {
      setError("Não consegui ler esse arquivo. Tente outro formato ou copie o texto manualmente.");
      setStage("idle");
      return;
    }

    const phrases = splitIntoStudyPhrases(rawText, maxItems);
    if (phrases.length === 0) {
      setError("Não encontrei frases aproveitáveis nesse arquivo.");
      setStage("idle");
      return;
    }

    setStage("translating");
    setProgress({ done: 0, total: phrases.length });
    const translations = await translateBatch(phrases, (done, total) =>
      setProgress({ done, total })
    );

    const newDrafts: DraftItem[] = phrases.map((en, i) => ({
      id: generateId(),
      en,
      pt: translations[i] || "",
      include: true,
    }));

    setDrafts(newDrafts);
    setStage("review");
  }

  function handleDraftChange(id: string, field: "en" | "pt", value: string) {
    setDrafts((ds) => ds.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }

  function toggleInclude(id: string) {
    setDrafts((ds) => ds.map((d) => (d.id === id ? { ...d, include: !d.include } : d)));
  }

  function handleSaveAll() {
    const toSave = drafts.filter((d) => d.include && d.en.trim() && d.pt.trim());
    for (const d of toSave) {
      const item: ContentItem = {
        id: d.id,
        type: "phrase",
        en: d.en.trim(),
        pt: d.pt.trim(),
        tags: ["importado"],
        lessonName: lessonName.trim() || fileName || "Importação",
        dateAdded: new Date().toISOString(),
        box: 1,
        nextReview: TODAY_KEY(),
        lastReviewed: null,
        timesReviewed: 0,
        timesCorrect: 0,
      };
      addContentItem(item);
    }
    setSavedCount(toSave.length);
    setStage("saved");
  }

  function reset() {
    setStage("idle");
    setDrafts([]);
    setError("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const includedCount = drafts.filter((d) => d.include).length;

  if (stage === "idle") {
    return (
      <div className="card-notebook space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-paper-200/70">Nome da aula (opcional)</span>
            <input
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              placeholder="Ex: Capítulo 3 do livro"
              className="focus-ring w-full rounded border border-ink-600 bg-ink-900 p-2.5 text-sm outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-paper-200/70">Máximo de frases a importar</span>
            <input
              type="number"
              min={5}
              max={100}
              value={maxItems}
              onChange={(e) => setMaxItems(Number(e.target.value))}
              className="focus-ring w-full rounded border border-ink-600 bg-ink-900 p-2.5 text-sm outline-none"
            />
          </label>
        </div>

        <label className="focus-ring flex cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-ink-600 p-8 text-center hover:border-amber-dark">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm text-paper-100">Clique para escolher um arquivo</span>
          <span className="text-xs text-paper-200/50">PDF, DOCX ou TXT</span>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>

        {error && <p className="text-sm text-coral">{error}</p>}

        <p className="text-xs text-paper-200/50">
          O texto é extraído e traduzido automaticamente (tradução simples, feita por um
          serviço gratuito) — depois você revisa e ajusta antes de salvar.
        </p>
      </div>
    );
  }

  if (stage === "reading") {
    return (
      <div className="card-notebook p-6 text-center text-sm text-paper-200/70">
        Lendo o arquivo <span className="text-paper-100">{fileName}</span>...
      </div>
    );
  }

  if (stage === "translating") {
    const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
    return (
      <div className="card-notebook space-y-3 p-6 text-center">
        <p className="text-sm text-paper-200/70">Traduzindo frases automaticamente...</p>
        <div className="h-2 w-full overflow-hidden rounded bg-ink-700">
          <div className="h-full bg-amber transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="font-mono text-xs text-paper-200/50">
          {progress.done} / {progress.total}
        </p>
      </div>
    );
  }

  if (stage === "saved") {
    return (
      <div className="card-notebook space-y-4 p-6 text-center">
        <p className="font-display text-xl">Importação concluída! 🎉</p>
        <p className="text-sm text-paper-200/70">
          {savedCount} item(ns) adicionado(s) ao seu material de estudo.
        </p>
        <button
          onClick={reset}
          className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
        >
          Importar outro arquivo
        </button>
      </div>
    );
  }

  // stage === "review"
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-paper-200/70">
          {drafts.length} frase(s) encontrada(s) — {includedCount} selecionada(s). Revise as
          traduções antes de salvar.
        </p>
        <button onClick={reset} className="focus-ring text-xs text-paper-200/60 hover:text-paper-100">
          Cancelar importação
        </button>
      </div>

      <ul className="space-y-3">
        {drafts.map((d) => (
          <li key={d.id} className="card-notebook flex gap-3 p-4">
            <input
              type="checkbox"
              checked={d.include}
              onChange={() => toggleInclude(d.id)}
              className="mt-2 h-4 w-4 shrink-0 accent-amber"
              aria-label="Incluir este item"
            />
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <textarea
                value={d.en}
                onChange={(e) => handleDraftChange(d.id, "en", e.target.value)}
                rows={2}
                className="focus-ring w-full rounded border border-ink-600 bg-ink-900 p-2 text-sm outline-none"
              />
              <textarea
                value={d.pt}
                onChange={(e) => handleDraftChange(d.id, "pt", e.target.value)}
                rows={2}
                placeholder="Tradução (edite se precisar)"
                className="focus-ring w-full rounded border border-ink-600 bg-ink-900 p-2 text-sm outline-none"
              />
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSaveAll}
        disabled={includedCount === 0}
        className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light disabled:opacity-50"
      >
        Salvar {includedCount} item(ns) selecionado(s)
      </button>
    </div>
  );
}
