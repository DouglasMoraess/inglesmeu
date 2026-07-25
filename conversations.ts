"use client";

import { useRef, useState } from "react";
import { detectFileType, extractTextFromFile, splitIntoStudyPhrases } from "@/lib/textExtract";
import { translateBatch } from "@/lib/translate";
import { addContentItem, generateId } from "@/lib/storage";
import { ContentItem } from "@/lib/types";

type Stage = "idle" | "reading" | "translating" | "saved";

const TODAY_KEY = () => new Date().toISOString().slice(0, 10);
const MAX_ITEMS = 40;

export default function FileImportPanel() {
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
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
      setError("Não consegui ler esse arquivo. Tente outro arquivo.");
      setStage("idle");
      return;
    }

    const phrases = splitIntoStudyPhrases(rawText, MAX_ITEMS);
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

    let saved = 0;
    for (let i = 0; i < phrases.length; i++) {
      const pt = translations[i];
      if (!pt) continue; // skip items the free translation service couldn't handle
      const item: ContentItem = {
        id: generateId(),
        type: "phrase",
        en: phrases[i],
        pt,
        tags: ["importado"],
        lessonName: file.name.replace(/\.[^.]+$/, ""),
        dateAdded: new Date().toISOString(),
        box: 1,
        nextReview: TODAY_KEY(),
        lastReviewed: null,
        timesReviewed: 0,
        timesCorrect: 0,
      };
      addContentItem(item);
      saved++;
    }

    setSavedCount(saved);
    setStage("saved");
  }

  function reset() {
    setStage("idle");
    setError("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  }

  if (stage === "idle") {
    return (
      <div className="card-notebook space-y-4 p-5">
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
          É só isso: escolha o arquivo e o app extrai o texto, traduz automaticamente e já
          salva tudo pronto pra virar exercício, flashcard e revisão.
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

  // stage === "saved"
  return (
    <div className="card-notebook space-y-4 p-6 text-center">
      <p className="font-display text-xl">Importação concluída! 🎉</p>
      <p className="text-sm text-paper-200/70">
        {savedCount} item(ns) de <span className="text-paper-100">{fileName}</span>{" "}
        adicionado(s) ao seu material de estudo.
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
