# Meu Inglês — Caderno de Estudos

App para estudar inglês: você adiciona palavras, frases e textos, e o sistema
gera automaticamente exercícios, flashcards, revisão espaçada e simulações de
conversação. Tudo funciona no navegador, sem backend — os dados ficam salvos
no `localStorage` do seu computador/celular.

## O que tem pronto

- **Conteúdo**: adicionar palavras, frases ou textos com tradução, tags e nome da aula.
- **Exercícios automáticos**: tradução EN→PT e PT→EN, múltipla escolha, completar frase.
- **Flashcards**: cartão vira ao tocar, marcação fácil/médio/difícil.
- **Revisão espaçada**: sistema tipo Anki (caixas 1 a 5, intervalos crescentes).
- **Conversação**: diálogos simulados com correção simples e sugestão de resposta.
- **Pronúncia**: botão "Ouvir" (fala o texto em inglês) e "Praticar pronúncia"
  (usa o microfone para comparar o que você falou, via Web Speech API — funciona
  melhor no Google Chrome).
- **Painel**: total de palavras, sequência de dias estudando, taxa de acerto.
- **Tema escuro**, responsivo para celular e computador.

## Pronto para o futuro: IA de verdade

O arquivo `lib/ai.ts` já está preparado para, no futuro, você conectar a API da
Anthropic (Claude) e deixar as correções da conversação muito mais inteligentes.
Basta seguir as instruções em comentário dentro do próprio arquivo. Nada mais no
projeto precisa mudar.

---

# Passo a passo: colocar o app no ar (sem programar)

Você vai precisar de duas contas gratuitas: **GitHub** e **Vercel**. Se ainda
não tem, crie em [github.com](https://github.com) e [vercel.com](https://vercel.com)
(pode entrar na Vercel usando sua conta do GitHub, é mais rápido).

## Parte 1 — Subir os arquivos no GitHub

1. Entre em [github.com](https://github.com) e clique no botão verde **"New"**
   (ou no `+` no canto superior direito → **"New repository"**).
2. Dê um nome ao repositório, por exemplo `meu-ingles`. Deixe como **Public**
   ou **Private**, tanto faz. Não marque nenhuma opção extra. Clique em
   **"Create repository"**.
3. Na página que abrir, procure o link **"uploading an existing file"**
   (às vezes aparece como "upload files").
4. Agora, no seu computador, descompacte o arquivo `.zip` que você recebeu.
   Você vai ver uma pasta chamada `english-app` com tudo dentro.
5. Arraste **todos os arquivos e pastas de dentro de `english-app`** (não a
   pasta em si, o conteúdo dela) para a área de upload do GitHub.
   - Dica: selecione tudo dentro da pasta (Ctrl+A no Windows / Cmd+A no Mac)
     e arraste para o navegador.
6. Espere o upload terminar e clique em **"Commit changes"** (botão verde
   no final da página).

Pronto — seu projeto já está no GitHub.

## Parte 2 — Conectar no Vercel

1. Entre em [vercel.com](https://vercel.com) e faça login (pode usar "Continue with GitHub").
2. Clique em **"Add New..."** → **"Project"**.
3. A Vercel vai mostrar seus repositórios do GitHub. Encontre `meu-ingles`
   (ou o nome que você deu) e clique em **"Import"**.
4. Na tela de configuração, você **não precisa mudar nada** — a Vercel já
   detecta que é um projeto Next.js automaticamente.
5. Clique no botão azul **"Deploy"**.
6. Espere cerca de 1 a 2 minutos. Quando aparecer a tela de confete 🎉,
   seu app está no ar!
7. Clique em **"Continue to Dashboard"** e depois no botão **"Visit"** (ou
   copie o link que aparece, algo como `meu-ingles.vercel.app`) para acessar
   o app pelo celular ou computador.

## Como atualizar o app no futuro

Sempre que você (ou eu) mudar algo no código:

1. Vá até o repositório no GitHub.
2. Clique no arquivo que mudou → ícone de lápis (editar) → cole o novo
   conteúdo → **"Commit changes"**.
   - Ou, se forem muitos arquivos, use **"Add file" → "Upload files"** e
     suba os arquivos novos (o GitHub substitui os antigos automaticamente).
3. A Vercel detecta a mudança sozinha e já publica a nova versão em
   1 a 2 minutos. Você não precisa fazer nada na Vercel.

## Rodar no seu computador (opcional, se quiser testar antes de subir)

Se você tiver o [Node.js](https://nodejs.org) instalado, pode rodar
localmente. Abra o terminal dentro da pasta do projeto e cole:

```
npm install
npm run dev
```

Depois abra `http://localhost:3000` no navegador.

## Aviso importante sobre os dados

Como o app usa `localStorage`, os dados ficam salvos **apenas no navegador
onde você usou o app**. Se você trocar de celular/computador ou limpar os
dados do navegador, o conteúdo salvo será perdido. Isso é intencional (o app
não usa backend), mas é bom saber disso.
