@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html,
body {
  background-color: #0f1119;
  color: #f4f1ea;
}

::selection {
  background-color: #e8a33d;
  color: #0f1119;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #454b6b #14161f;
}

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: #14161f;
}

*::-webkit-scrollbar-thumb {
  background: #454b6b;
  border-radius: 4px;
}

/* Signature element: the "margin rule" — a vertical notebook margin line
   with tab-like page markers, echoed on cards and the side nav. */
.margin-rule {
  position: relative;
}

.margin-rule::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #e8a33d 0%, rgba(232, 163, 61, 0.15) 100%);
}

.card-notebook {
  background-color: #1c1f2e;
  border: 1px solid #262a3d;
  border-left: 3px solid #e8a33d;
  border-radius: 6px;
}

.flip-card {
  perspective: 1200px;
}

.flip-card-inner {
  transition: transform 0.5s;
  transform-style: preserve-3d;
  position: relative;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  backface-visibility: hidden;
  position: absolute;
  inset: 0;
}

.flip-card-back {
  transform: rotateY(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .flip-card-inner {
    transition: none;
  }
}

.focus-ring:focus-visible {
  outline: 2px solid #e8a33d;
  outline-offset: 2px;
}
