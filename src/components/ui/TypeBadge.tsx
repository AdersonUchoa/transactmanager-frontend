type Type = "Receita" | "Despesa";

interface TypeBadgeProps {
  tipo: Type;
}

const styles: Record<Type, string> = {
  Receita: "bg-emerald-500/15 text-emerald-400",
  Despesa: "bg-red-500/15 text-red-400",
};

const fallback = "bg-zinc-500/15 text-zinc-400";

export function TypeBadge({ tipo }: TypeBadgeProps) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[tipo] ?? fallback}`}>
      {tipo}
    </span>
  );
}