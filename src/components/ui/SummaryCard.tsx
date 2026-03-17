interface SummaryCardProps {
  title: string
  value: number
  color?: "green" | "red"
}

export function SummaryCard({ title, value, color }: SummaryCardProps) {

  const colorClass =
    color === "green"
      ? "text-emerald-400"
      : "text-red-400"

  return (
    <div className="
      rounded-xl
      border border-zinc-800
      bg-gradient-to-br from-zinc-900 to-zinc-950
      p-4
      transition
      hover:border-zinc-700
      hover:shadow-lg
    ">
      <p className="text-xs text-zinc-400 tracking-wide">
        {title}
      </p>

      <p className={`text-2xl font-bold mt-2 ${colorClass}`}>
        R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}