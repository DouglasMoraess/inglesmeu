/**
 * lib/ai.ts
 * ---------------------------------------------------------------------------
 * Este arquivo é o único lugar do projeto pensado para, no futuro, conectar
 * o app a uma IA de verdade (por exemplo a API da Anthropic/Claude).
 *
 * Hoje o app funciona 100% sem backend, então as funções abaixo usam regras
 * simples (comparação de palavras-chave). Quando você quiser deixar o app
 * "inteligente de verdade", basta:
 *
 *   1. Criar uma rota de API em `app/api/ai/route.ts` (isso já usaria um
 *      backend simples, ex: uma Serverless Function da Vercel) que chama a
 *      API da Anthropic usando sua chave (guardada em variável de ambiente).
 *   2. Trocar o corpo das funções abaixo por um `fetch("/api/ai", ...)`
 *      apontando para essa rota.
 *
 * Nenhuma outra parte do app precisa mudar — todos os componentes já chamam
 * apenas as funções `getConversationFeedback` e `getFreeformCorrection`
 * exportadas aqui.
 * ---------------------------------------------------------------------------
 */

export interface AIFeedback {
  isGoodAnswer: boolean;
  feedback: string;
  suggestion: string;
}

/**
 * Avalia a resposta do usuário em uma simulação de diálogo comparando com
 * palavras-chave esperadas. Troque o corpo desta função por uma chamada de
 * API real quando quiser respostas mais inteligentes.
 */
export function getConversationFeedback(
  userAnswer: string,
  expectedKeywords: string[],
  sampleAnswer: string
): AIFeedback {
  const normalized = userAnswer.toLowerCase();
  const hits = expectedKeywords.filter((k) => normalized.includes(k.toLowerCase()));
  const isGoodAnswer = hits.length > 0 && userAnswer.trim().length > 2;

  return {
    isGoodAnswer,
    feedback: isGoodAnswer
      ? "Boa resposta! Faz sentido no contexto do diálogo."
      : "Sua resposta pode não se encaixar bem aqui. Tente usar palavras relacionadas ao contexto.",
    suggestion: sampleAnswer,
  };
}

/**
 * Correção simples de texto livre (usada em exercícios de escrita).
 * Aponta diferenças básicas de capitalização/pontuação. Substitua por uma
 * chamada de IA real para correções gramaticais completas.
 */
export function getFreeformCorrection(userText: string, referenceText: string): AIFeedback {
  const clean = (s: string) => s.trim().toLowerCase();
  const isGoodAnswer = clean(userText) === clean(referenceText);

  return {
    isGoodAnswer,
    feedback: isGoodAnswer
      ? "Perfeito, exatamente como esperado!"
      : "Quase lá — compare com a sugestão abaixo e observe as diferenças.",
    suggestion: referenceText,
  };
}

/**
 * Placeholder pronto para o futuro: quando você conectar uma API de IA real,
 * chame esta função a partir dos componentes ao invés de fetch direto.
 * Por enquanto ela apenas devolve uma mensagem fixa.
 */
export async function getAIResponse(prompt: string): Promise<string> {
  // Exemplo de como ficaria com uma rota de API própria:
  //
  // const res = await fetch("/api/ai", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ prompt }),
  // });
  // const data = await res.json();
  // return data.text;

  return `(IA ainda não conectada) Você perguntou: "${prompt}"`;
}
