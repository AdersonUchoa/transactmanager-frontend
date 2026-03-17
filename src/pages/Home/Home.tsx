import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pessoaService } from "../../services/pessoaService";
import { categoriaService } from "../../services/categoriaService";
import { transacaoService } from "../../services/transacaoService";

interface DashboardCounts {
  pessoas: number;
  categorias: number;
  transacoes: number;
}

interface DashboardCard {
  label: string;
  count: number | null;
  description: string;
  path: string;
  color: string;
  icon: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<DashboardCounts>({
    pessoas: 0,
    categorias: 0,
    transacoes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [pessoas, categorias, transacoes] = await Promise.all([
          pessoaService.getCount(),
          categoriaService.getCount(),
          transacaoService.getCount(),
        ]);
        setCounts({
          pessoas: pessoas.data,
          categorias: categorias.data,
          transacoes: transacoes.data,
        });
      } catch (error) {
        console.error("Erro ao buscar contagens:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const cards: DashboardCard[] = [
    {
      label: "Pessoas",
      count: counts.pessoas,
      description: "Gerencie as pessoas cadastradas no sistema.",
      path: "/pessoas",
      color: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50",
      icon: "👤",
    },
    {
      label: "Categorias",
      count: counts.categorias,
      description: "Organize as categorias de despesas e receitas.",
      path: "/categorias",
      color: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50",
      icon: "🏷️",
    },
    {
      label: "Transações",
      count: counts.transacoes,
      description: "Acompanhe todas as transações registradas.",
      path: "/transacoes",
      color: "bg-violet-500/10 border-violet-500/20 hover:border-violet-500/50",
      icon: "💸",
    },
  ];

  return (
    <div className="flex flex-col gap-10">

      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Visão geral do sistema de controle de gastos residenciais.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className={`rounded-xl border p-6 text-left transition-all duration-200 cursor-pointer ${card.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              {loading ? (
                <span className="text-zinc-500 text-sm">...</span>
              ) : (
                <span className="text-3xl font-bold text-white">{card.count}</span>
              )}
            </div>
            <p className="text-white font-semibold text-lg">{card.label}</p>
            <p className="text-zinc-400 text-sm mt-1">{card.description}</p>
          </button>
        ))}
      </div>

    </div>
  );
}