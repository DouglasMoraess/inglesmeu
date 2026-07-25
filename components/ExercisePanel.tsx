"use client";

import { useState } from "react";
import { ContentItem, ExerciseQuestion } from "@/lib/types";
import { generateExerciseSet, isAnswerCorrect } from "@/lib/exercises";
import { applyReview } from "@/lib/srs";
import { updateContentItem } from "@/lib/storage";
import SpeakButton from "@/components/SpeakButton";

interface ExercisePanelProps {
  items: ContentItem[];
}

type Kind = ExerciseQuestion["kind"];

const KIND_LABELS: Record<Kind, string> = {
  "translation-en-pt": "Tradução: Inglês → Português",
  "translation-pt-en": "Tradução: Português → Inglês",
  "multiple-choice": "Múltipla escolha",
  "fill-blank": "Completar frase",
};

export default function ExercisePanel({ items }: ExercisePanelProps) {
  const [kind, setKind] = useState<Kind>("translation-en-pt");
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<ExerciseQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);

  const usableCount = items.filter((i) => i.en.trim() && i.pt.trim()).length;

  const currentQuestion = session ? session[index] : null;

  function startSession() {
    const set = generateExerciseSet(items, kind, count);
    setSession(set);
    setIndex(0);
    setScore(0);
    setAnswer("");
    setFeedback(null);
  }

  function registerResult(correct: boolean) {
    if (!currentQuestion) return;
    const item = items.find((i) => i.id === currentQuestion.sourceId);
    if (item) {
      const updated = applyReview(item, correct ? "facil" : "dificil");
      updateContentItem(updated);
    }
    setScore((s) => s + (correct ? 1 : 0));
  }

  function handleCheck() {
    if (!currentQuestion) return;
    const correct = isAnswerCorrect(answer, currentQuestion.answer);
    setFeedback(correct ? "correct" : "wrong");
    registerResult(correct);
  }

  function handleChoice(option: string) {
    if (!currentQuestion) return;
    const correct = option === currentQuestion.answer;
    setAnswer(option);
    setFeedback(correct ? "correct" : "wrong");
    registerResult(correct);
  }

  function handleNext() {
    if (!session) return;
    if (index + 1 >= session.length) {
      setIndex(session.length); // triggers "finished" view
    } else {
      setIndex((i) => i + 1);
      setAnswer("");
      setFeedback(null);
    }
  }

  function reset() {
    setSession(null);
  }

  const finished = session && index >= session.length;

  if (usableCount === 0) {
    return (
      <p className="card-notebook p-5 text-sm text-paper-200/70">
        Adicione palavras ou frases com tradução na seção{" "}
        <span className="text-amber">Conteúdo</span> para gerar exercícios automaticamente.
      </p>
    );
  }

  if (!session) {
    return (
      <div className="card-notebook space-y-4 p-5">
        <div>
          <span className="mb-2 block text-sm text-paper-200/70">Tipo de exercício</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(KIND_LABELS) as Kind[]).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`focus-ring rounded px-3 py-1.5 text-xs font-medium ${
                  kind === k ? "bg-amber text-ink-950" : "border border-ink-600 text-paper-200/70"
                }`}
              >
                {KIND_LABELS[k]}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block text-paper-200/70">
            Quantidade de questões (máximo {usableCount})
          </span>
          <input
            type="number"
            min={1}
            max={usableCount}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="focus-ring w-28 rounded border border-ink-600 bg-ink-900 p-2 text-sm outline-none"
          />
        </label>

        <button
          onClick={startSession}
          className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
        >
          Começar exercício
        </button>
      </div>
    );
  }

  if (finished) {
    const total = session.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="card-notebook space-y-4 p-5 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-dark">Resultado</p>
        <p className="font-display text-4xl font-semibold">
          {score}/{total}
        </p>
        <p className="text-sm text-paper-200/70">{pct}% de acerto nesta sessão</p>
        <button
          onClick={reset}
          className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
        >
          Praticar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="card-notebook space-y-4 p-5">
      <div className="flex items-center justify-between text-xs text-paper-200/60">
        <span>{KIND_LABELS[kind]}</span>
        <span className="font-mono">
          {index + 1} / {session.length}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <p className="font-display text-2xl">{currentQuestion?.prompt}</p>
        {(kind === "translation-en-pt" || kind === "fill-blank") && currentQuestion && (
          <SpeakButton text={currentQuestion.prompt.replace(/_____/g, "blank")} />
        )}
      </div>

      {kind === "multiple-choice" && currentQuestion?.options ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {currentQuestion.options.map((opt) => {
            const isSelected = answer === opt;
            const isCorrectOpt = opt === currentQuestion.answer;
            const showState = feedback !== null && (isSelected || isCorrectOpt);
            return (
              <button
                key={opt}
                disabled={feedback !== null}
                onClick={() => handleChoice(opt)}
                className={`focus-ring rounded border px-3 py-2 text-left text-sm transition-colors ${
                  showState
                    ? isCorrectOpt
                      ? "border-teal bg-teal/10 text-teal"
                      : "border-coral bg-coral/10 text-coral"
                    : "border-ink-600 hover:bg-ink-800"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={feedback !== null}
            placeholder="Digite sua resposta..."
            className="focus-ring min-w-[220px] flex-1 rounded border border-ink-600 bg-ink-900 p-2.5 text-sm outline-none"
            onKeyDown={(e) => e.key === "Enter" && feedback === null && handleCheck()}
          />
          {feedback === null && (
            <button
              onClick={handleCheck}
              className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
            >
              Verificar
            </button>
          )}
        </div>
      )}

      {feedback && (
        <div className={`rounded p-3 text-sm ${feedback === "correct" ? "bg-teal/10 text-teal" : "bg-coral/10 text-coral"}`}>
          {feedback === "correct" ? "Correto!" : `Resposta certa: ${currentQuestion?.answer}`}
        </div>
      )}

      {feedback && (
        <button
          onClick={handleNext}
          className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
        >
          {index + 1 >= session.length ? "Ver resultado" : "Próxima"}
        </button>
      )}
    </div>
  );
}
