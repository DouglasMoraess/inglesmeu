import { AppSettings, ContentItem } from "./types";

const KEYS = {
  content: "ela_content_items",
  studyDays: "ela_study_days",
  settings: "ela_settings",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- Content items ---------- */

export function getContentItems(): ContentItem[] {
  return read<ContentItem[]>(KEYS.content, []);
}

export function saveContentItems(items: ContentItem[]) {
  write(KEYS.content, items);
}

export function addContentItem(item: ContentItem) {
  const items = getContentItems();
  items.unshift(item);
  saveContentItems(items);
  markStudyToday();
  return items;
}

export function updateContentItem(updated: ContentItem) {
  const items = getContentItems().map((i) => (i.id === updated.id ? updated : i));
  saveContentItems(items);
  return items;
}

export function deleteContentItem(id: string) {
  const items = getContentItems().filter((i) => i.id !== id);
  saveContentItems(items);
  return items;
}

/* ---------- Study day streak tracking ---------- */

export function getStudyDays(): string[] {
  return read<string[]>(KEYS.studyDays, []);
}

export function markStudyToday() {
  const today = new Date().toISOString().slice(0, 10);
  const days = getStudyDays();
  if (!days.includes(today)) {
    days.push(today);
    write(KEYS.studyDays, days);
  }
}

export function getStudyStreak(): number {
  const days = new Set(getStudyDays());
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/* ---------- Settings ---------- */

export function getSettings(): AppSettings {
  return read<AppSettings>(KEYS.settings, { dailyGoal: 10 });
}

export function saveSettings(settings: AppSettings) {
  write(KEYS.settings, settings);
}

/* ---------- IDs ---------- */

export function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
