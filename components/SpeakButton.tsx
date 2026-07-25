"use client";

import { speak } from "@/lib/utils";

interface SpeakButtonProps {
  text: string;
  className?: string;
}

export default function SpeakButton({ text, className }: SpeakButtonProps) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={`Ouvir "${text}" em inglês`}
      title="Ouvir pronúncia"
      className={
        className ??
        "focus-ring inline-flex items-center gap-1 rounded border border-ink-600 px-2 py-1 text-xs text-paper-200/80 hover:bg-ink-800"
      }
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M11 5 6 9H3v6h3l5 4V5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M16 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      Ouvir
    </button>
  );
}
