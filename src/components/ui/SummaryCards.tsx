import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { StatCard } from "./StatCard";

interface SummaryCardsProps {
  receitas?: number;
  despesas?: number;
  saldo?: number;
}

export function SummaryCards({ receitas = 0, despesas = 0, saldo = 0 }: SummaryCardsProps) {

  const format = (value: number) =>
    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard
        title="Total de Receitas"
        value={format(receitas)}
        icon={<TrendingUp size={20} />}
        color="green"
      />

      <StatCard
        title="Total de Despesas"
        value={format(despesas)}
        icon={<TrendingDown size={20} />}
        color="red"
      />

      <StatCard
        title="Saldo Líquido"
        value={format(saldo)}
        icon={<Wallet size={20} />}
        color={saldo >= 0 ? "green" : "red"}
      />
    </div>
  );
}