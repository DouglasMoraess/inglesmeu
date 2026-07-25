"use client";

import FileImportPanel from "@/components/FileImportPanel";

export default function ImportPage() {
  return (
    <div className="margin-rule pl-6">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-dark">Importar</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
        Suba um arquivo e deixe o app montar os exercícios
      </h1>
      <p className="mt-2 max-w-xl text-sm text-paper-200/70">
        Envie um PDF, DOCX ou TXT com o conteúdo que você recebeu na aula. O app extrai as
        frases, tenta traduzir automaticamente e já deixa tudo pronto para virar exercício,
        flashcard e revisão.
      </p>

      <div className="mt-6">
        <FileImportPanel />
      </div>
    </div>
  );
}
