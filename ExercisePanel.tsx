import ConversationView from "@/components/ConversationView";

export default function ConversationPage() {
  return (
    <div className="margin-rule pl-6">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-dark">Conversação</p>
      <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
        Simule um diálogo
      </h1>
      <p className="mt-2 max-w-xl text-sm text-paper-200/70">
        Escolha uma situação, responda em inglês e receba uma correção simples com sugestão.
      </p>

      <div className="mt-8">
        <ConversationView />
      </div>
    </div>
  );
}
