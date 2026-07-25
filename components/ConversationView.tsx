"use client";

import { useState } from "react";
import { CONVERSATION_SCRIPTS } from "@/lib/conversations";
import { getConversationFeedback, AIFeedback } from "@/lib/ai";
import SpeakButton from "@/components/SpeakButton";

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export default function ConversationView() {
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [history, setHistory] = useState<{ speaker: "bot" | "user"; text: string }[]>([]);

  const script = CONVERSATION_SCRIPTS.find((s) => s.id === scriptId) ?? null;

  function startScript(id: string) {
    const chosen = CONVERSATION_SCRIPTS.find((s) => s.id === id);
    if (!chosen) return;
    setScriptId(id);
    setTurnIndex(0);
    setFeedback(null);
    setUserInput("");
    setHistory([{ speaker: "bot", text: chosen.turns[0].bot }]);
  }

  function handleSend() {
    if (!script || !userInput.trim()) return;
    const turn = script.turns[turnIndex];
    const result = getConversationFeedback(userInput, turn.expectedKeywords, turn.sampleAnswer);
    setFeedback(result);
    setHistory((h) => [...h, { speaker: "user", text: userInput }]);
  }

  function handleContinue() {
    if (!script) return;
    const nextIndex = turnIndex + 1;
    setUserInput("");
    setFeedback(null);
    if (nextIndex < script.turns.length) {
      setTurnIndex(nextIndex);
      setHistory((h) => [...h, { speaker: "bot", text: script.turns[nextIndex].bot }]);
    } else {
      setHistory((h) => [...h, { speaker: "bot", text: "Great job! That's the end of this dialogue. 🎉" }]);
      setTurnIndex(nextIndex);
    }
  }

  function backToMenu() {
    setScriptId(null);
    setHistory([]);
    setFeedback(null);
    setUserInput("");
  }

  if (!script) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {CONVERSATION_SCRIPTS.map((s) => (
          <button
            key={s.id}
            onClick={() => startScript(s.id)}
            className="focus-ring card-notebook p-5 text-left hover:bg-ink-800"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-dark">
              {LEVEL_LABELS[s.level]}
            </span>
            <p className="mt-1 font-display text-lg font-semibold">{s.title}</p>
            <p className="mt-1 text-sm text-paper-200/60">{s.description}</p>
          </button>
        ))}
      </div>
    );
  }

  const finished = turnIndex >= script.turns.length;

  return (
    <div className="mx-auto max-w-lg">
      <button onClick={backToMenu} className="focus-ring mb-4 text-xs text-paper-200/60 hover:text-paper-100">
        ← Voltar para os diálogos
      </button>

      <div className="card-notebook space-y-3 p-5">
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {history.map((turn, i) => (
            <div
              key={i}
              className={`flex ${turn.speaker === "bot" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  turn.speaker === "bot"
                    ? "bg-ink-700 text-paper-100"
                    : "bg-amber/20 text-paper-100"
                }`}
              >
                {turn.text}
                {turn.speaker === "bot" && (
                  <div className="mt-1">
                    <SpeakButton
                      text={turn.text}
                      className="focus-ring text-[10px] text-paper-200/50 underline"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!finished && (
          <>
            <div className="flex gap-2">
              <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={feedback !== null}
                placeholder="Responda em inglês..."
                className="focus-ring flex-1 rounded border border-ink-600 bg-ink-900 p-2.5 text-sm outline-none"
                onKeyDown={(e) => e.key === "Enter" && feedback === null && handleSend()}
              />
              {feedback === null && (
                <button
                  onClick={handleSend}
                  className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
                >
                  Enviar
                </button>
              )}
            </div>

            {feedback && (
              <div
                className={`rounded p-3 text-sm ${
                  feedback.isGoodAnswer ? "bg-teal/10 text-teal" : "bg-coral/10 text-coral"
                }`}
              >
                <p>{feedback.feedback}</p>
                <p className="mt-1 text-paper-200/70">
                  Sugestão: <span className="italic">{feedback.suggestion}</span>
                </p>
              </div>
            )}

            {feedback && (
              <button
                onClick={handleContinue}
                className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
              >
                Continuar
              </button>
            )}
          </>
        )}

        {finished && (
          <button
            onClick={backToMenu}
            className="focus-ring rounded bg-amber px-4 py-2 text-sm font-medium text-ink-950 hover:bg-amber-light"
          >
            Escolher outro diálogo
          </button>
        )}
      </div>
    </div>
  );
}
