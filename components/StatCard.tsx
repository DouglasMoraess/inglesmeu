interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  eyebrow: string;
}

export default function StatCard({ label, value, hint, eyebrow }: StatCardProps) {
  return (
    <div className="card-notebook p-5">
      <span className="font-mono text-xs uppercase tracking-wider text-amber-dark">{eyebrow}</span>
      <p className="mt-2 font-display text-3xl font-semibold text-paper-100">{value}</p>
      <p className="mt-1 text-sm text-paper-200/70">{label}</p>
      {hint && <p className="mt-2 text-xs text-paper-200/50">{hint}</p>}
    </div>
  );
}
