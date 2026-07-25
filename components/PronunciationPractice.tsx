"use client";

import { useState } from "react";
import { isSpeechRecognitionSupported, recognizeSpeech } from "@/lib/utils";
import { isAnswerCorrect } from "@/lib/exercises";

interface PronunciationPracticeProps {
  targetText: string;
}

export default function PronunciationPractice({ targetText }: PronunciationPracticeProps) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<{ heard: string; correct: boolean } | null>(null);
  const supported = isSpeechRecognitionSupported();

  async function handlePractice() {
    setResult(null);
    setListening(true);
    const heard = await recognizeSpeech();
    setListening(false);
    if (heard === null) {
      setResult({ heard: "(não foi possível reconhecer)", correct: false });
      return;
    }
    setResult({ heard, correct: isAnswerCorrect(heard, targetText) });
  }

  if (!supported) {
    return (
      <p className="text-xs text-paper-200/50">
        Seu navegador não suporta reconhecimento de voz. Estrutura pronta — funcionará
        automaticamente em navegadores compatíveis (ex: Chrome).
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePractice}
        disabled={listening}
        className="focus-ring inline-flex items-center gap-1 rounded border border-ink-600 px-2 py-1 text-xs text-paper-200/80 hover:bg-ink-800 disabled:opacity-50"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {listening ? "Ouvindo..." : "Praticar pronúncia"}
      </button>
      {result && (
        <p className={`mt-2 text-xs ${result.correct ? "text-teal" : "text-coral"}`}>
          Você disse: “{result.heard}” — {result.correct ? "correto!" : "tente de novo"}
        </p>
      )}
    </div>
  );
}
