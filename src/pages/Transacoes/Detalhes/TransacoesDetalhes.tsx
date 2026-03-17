import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { transacaoService } from "../../../services/transacaoService";
import { DetailHeader } from "../../../components/ui/DetailHeader";
import { DetailsCard } from "../../../components/ui/DetailsCard";
import type { Transacao } from "../../../types/entities";
import { PageState } from "../../../components/ui/PageState";
import { Tabs } from "../../../components/ui/Tabs";
import { TypeBadge } from "../../../components/ui/TypeBadge";

export default function TransacaoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [transacao, setTransacao] = useState<Transacao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransacao() {
      try {
        const response = await transacaoService.getById(Number(id));
        setTransacao(response.data);
      } catch (error) {
        console.error("Erro ao buscar transação:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransacao();
  }, [id]);

  if (loading || !transacao) return (
    <PageState
      loading={loading}
      found={!!transacao}
      notFoundMessage="Transação não encontrada."
      onBack={() => navigate("/transacoes")}
    />
  );

  return (
    <div className="flex flex-col gap-8 max-w-6xl w-full">

      <DetailHeader
        id={transacao.id}
        title={transacao.descricao}
        fields={[
          { label: "Tipo", value: transacao.tipo },
          { label: "Valor", value: `R$ ${Number(transacao.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
        ]}
        onBack={() => navigate("/transacoes")}
      />

      <Tabs
        tabs={[
          {
            key: "detalhes",
            label: "Detalhes",
            content: (
              <DetailsCard
                items={[
                  { label: "ID", value: transacao.id },
                  { label: "Descrição", value: transacao.descricao },
                  { label: "Valor", value: ( <span className={transacao.tipo === "Receita" ? "text-emerald-400" : "text-red-400"}> R$ {Number(transacao.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>)},
                  { label: "Tipo", value: <TypeBadge tipo={transacao.tipo} /> },
                ]}
              />
            ),
          },
          {
            key: "relacoes",
            label: "Relacionados",
            content: (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2 px-1">Pessoa</p>
                  <DetailsCard items={[
                    { label: "Nome", value: transacao.pessoa?.nome },
                    { label: "Idade", value: `${transacao.pessoa?.idade} anos` },
                  ]} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2 px-1">Categoria</p>
                  <DetailsCard items={[
                    { label: "Descrição", value: transacao.categoria?.descricao },
                    { label: "Finalidade", value: transacao.categoria?.finalidade },
                  ]} />
                </div>
              </div>
            ),
          },
        ]}
      />

    </div>
  );
}