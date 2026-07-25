export type SupportedImportType = "pdf" | "docx" | "txt";

export function detectFileType(file: File): SupportedImportType | null {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".txt")) return "txt";
  return null;
}

async function extractFromPdf(file: File): Promise<string> {
  // Dynamic import keeps pdfjs-dist out of the server bundle (it only runs in the browser).
  const pdfjsLib = await import("pdfjs-dist");
  // The worker is loaded from a CDN (matched to the exact installed version) instead of
  // being bundled locally — bundling this file confuses Next.js's build-time minifier.
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const buffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => ("str" in item ? item.str : "")).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

async function extractFromDocx(file: File): Promise<string> {
  const mammoth = (await import("mammoth/mammoth.browser.js")).default;
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

async function extractFromTxt(file: File): Promise<string> {
  return file.text();
}

export async function extractTextFromFile(file: File): Promise<string> {
  const type = detectFileType(file);
  if (type === "pdf") return extractFromPdf(file);
  if (type === "docx") return extractFromDocx(file);
  if (type === "txt") return extractFromTxt(file);
  throw new Error("Formato de arquivo não suportado. Use PDF, DOCX ou TXT.");
}

/**
 * Splits raw extracted text into clean, study-sized sentences/phrases.
 * Filters out fragments that are too short or too long to make good
 * flashcards/exercises, and removes duplicates.
 */
export function splitIntoStudyPhrases(rawText: string, maxItems: number = 40): string[] {
  const normalized = rawText
    .replace(/\r/g, "")
    .replace(/-\n/g, "") // rejoin words split across a line break by a hyphen
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const rawSentences = normalized.split(/(?<=[.!?])\s+/);

  const seen = new Set<string>();
  const phrases: string[] = [];

  for (const sentence of rawSentences) {
    const trimmed = sentence.trim();
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    const key = trimmed.toLowerCase();

    if (wordCount < 3 || wordCount > 22) continue;
    if (seen.has(key)) continue;
    if (!/[a-zA-Z]/.test(trimmed)) continue;

    seen.add(key);
    phrases.push(trimmed);
    if (phrases.length >= maxItems) break;
  }

  return phrases;
}
