import { ContentItem, ExerciseQuestion } from "./types";

export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[.,!?;:'"]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(pool: ContentItem[], correct: ContentItem, field: "en" | "pt", count: number): string[] {
  const candidates = pool.filter((i) => i.id !== correct.id).map((i) => i[field]);
  return shuffle(candidates).slice(0, count);
}

/** Picks a word inside a phrase/text to blank out for fill-in-the-blank exercises. */
function pickBlankWord(sentence: string): { blanked: string; word: string } | null {
  const words = sentence.split(/\s+/).filter((w) => w.replace(/[.,!?;:]/g, "").length > 2);
  if (words.length === 0) return null;
  const target = words[Math.floor(Math.random() * words.length)];
  const cleaned = target.replace(/[.,!?;:]/g, "");
  const blanked = sentence.replace(target, "_____");
  return { blanked, word: cleaned };
}

export function generateExerciseSet(
  items: ContentItem[],
  kind: ExerciseQuestion["kind"],
  count: number
): ExerciseQuestion[] {
  const usable = items.filter((i) => i.en.trim() && i.pt.trim());
  const chosen = shuffle(usable).slice(0, Math.min(count, usable.length));
  const questions: ExerciseQuestion[] = [];

  for (const item of chosen) {
    if (kind === "translation-en-pt") {
      questions.push({
        id: item.id,
        kind,
        prompt: item.en,
        answer: item.pt,
        sourceId: item.id,
      });
    } else if (kind === "translation-pt-en") {
      questions.push({
        id: item.id,
        kind,
        prompt: item.pt,
        answer: item.en,
        sourceId: item.id,
      });
    } else if (kind === "multiple-choice") {
      const distractors = pickDistractors(usable, item, "pt", 3);
      const options = shuffle([item.pt, ...distractors]);
      if (options.length < 2) continue;
      questions.push({
        id: item.id,
        kind,
        prompt: item.en,
        answer: item.pt,
        options,
        sourceId: item.id,
      });
    } else if (kind === "fill-blank") {
      const source = item.type === "word" ? item.en : item.en;
      const blank = pickBlankWord(source);
      if (!blank) continue;
      questions.push({
        id: item.id,
        kind,
        prompt: blank.blanked,
        answer: blank.word,
        sourceId: item.id,
      });
    }
  }

  return questions;
}
