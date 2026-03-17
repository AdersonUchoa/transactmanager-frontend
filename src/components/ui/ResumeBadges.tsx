import { formatBRL } from "../../utils/formatBRL";

interface ResumoFinanceiroBadgesProps {
  totalReceitas?: number;
  totalDespesas?: number;
  saldo?: number;
}

export function ResumeBadges({
  totalReceitas,
  totalDespesas,
  saldo,
}: ResumoFinanceiroBadgesProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      <span className="text-xs font-medium px-2 py-1 rounded-md bg-emerald-500/12 text-emerald-400 flex items-center gap-1">
        <span className="text-[10px]">↑</span>
        {formatBRL(totalReceitas)}
      </span>
      <span className="text-xs font-medium px-2 py-1 rounded-md bg-red-500/12 text-red-400 flex items-center gap-1">
        <span className="text-[10px]">↓</span>
        {formatBRL(totalDespesas)}
      </span>
      <span className={`text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1 ${
        saldo == null
          ? "bg-zinc-500/12 text-zinc-400"
          : saldo >= 0
          ? "bg-blue-500/12 text-blue-400"
          : "bg-red-500/12 text-red-400"
      }`}>
        <span className="text-[10px]">=</span>
        {saldo != null && saldo < 0
          ? `- ${formatBRL(Math.abs(saldo))}`
          : formatBRL(saldo)}
      </span>
    </div>
  );
}