import { ContentItem, Difficulty } from "./types";

// Days to wait before the next review, indexed by Leitner box (1..5)
const BOX_INTERVALS_DAYS = [0, 1, 2, 4, 9, 20];

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Applies a review result to a content item, moving it up or down the
 * Leitner boxes and scheduling the next review date accordingly.
 */
export function applyReview(item: ContentItem, difficulty: Difficulty): ContentItem {
  let box = item.box;

  if (difficulty === "facil") {
    box = Math.min(5, box + 1);
  } else if (difficulty === "medio") {
    box = Math.max(1, box);
  } else {
    box = 1;
  }

  const intervalDays = BOX_INTERVALS_DAYS[box] ?? 1;
  const nextReview = toDateKey(addDays(new Date(), intervalDays));
  const wasCorrect = difficulty !== "dificil";

  return {
    ...item,
    box,
    nextReview,
    lastReviewed: new Date().toISOString(),
    timesReviewed: item.timesReviewed + 1,
    timesCorrect: item.timesCorrect + (wasCorrect ? 1 : 0),
  };
}

export function isDue(item: ContentItem): boolean {
  const today = toDateKey(new Date());
  return item.nextReview <= today;
}

export function getDueItems(items: ContentItem[]): ContentItem[] {
  return items.filter(isDue);
}
