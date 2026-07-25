export type ContentType = "word" | "phrase" | "text";

export interface ContentItem {
  id: string;
  type: ContentType;
  en: string;
  pt: string;
  tags: string[];
  lessonName: string;
  dateAdded: string; // ISO timestamp
  box: number; // Leitner box, 1..5
  nextReview: string; // ISO date (yyyy-mm-dd)
  lastReviewed: string | null;
  timesReviewed: number;
  timesCorrect: number;
}

export type Difficulty = "dificil" | "medio" | "facil";

export interface ConversationTurnTemplate {
  bot: string;
  expectedKeywords: string[];
  sampleAnswer: string;
}

export interface ConversationScript {
  id: string;
  title: string;
  level: "iniciante" | "intermediario" | "avancado";
  description: string;
  turns: ConversationTurnTemplate[];
}

export interface ExerciseQuestion {
  id: string;
  kind: "translation-en-pt" | "translation-pt-en" | "multiple-choice" | "fill-blank";
  prompt: string;
  answer: string;
  options?: string[];
  sourceId: string;
}

export interface AppSettings {
  dailyGoal: number;
}
