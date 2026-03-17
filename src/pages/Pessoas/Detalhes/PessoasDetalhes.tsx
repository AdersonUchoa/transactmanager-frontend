import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pessoaService } from "../../../services/pessoaService";
import { transacaoService } from "../../../services/transacaoService";
import type { Pessoa, Transacao } from "../../../types/entities";
import TransacaoFiltros from "../../../components/ui/TransacaoFiltros";
import { SummaryCards } from "../../../components/ui/SummaryCards";
import { DetailsCard } from "../../../components/ui/DetailsCard";
import { DetailHeader } from "../../../components/ui/DetailHeader";
import { PageState } from "../../../components/ui/PageState";
import { Tabs } from "../../../components/ui/Tabs";
import { TypeBadge } from "../../../components/ui/TypeBadge";

export default function PessoaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loadingPessoa, setLoadingPessoa] = useState(true);
  const [loadingTransacoes, setLoadingTransacoes] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [tipoInput, setTipoInput] = useState("");

  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    async function fetchPessoa() {
      setLoadingPessoa(true);
      try {
        const response = await pessoaService.getById(Number(id));
        setPessoa(response.data);
      } catch (error) {
        console.error("Erro ao buscar pessoa:", error);
      } finally {
        setLoadingPessoa(false);
      }
    }
    fetchPessoa();
  }, [id]);

  useEffect(() => {
    async function fetchTransacoes() {
      setLoadingTransacoes(true);
      try {
        const response = await transacaoService.getByPessoaId(Number(id), {
          search: search || undefined,
          tipo: tipo as "Despesa" | "Receita" | undefined || undefined,
          valor: valor ? Number(valor) : undefined,
        });
        setTransacoes(response.data.items);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoadingTransacoes(false);
      }
    }
    fetchTransacoes();
  }, [id, search, tipo, valor]);

  function handleSearch(valorNumerico?: number | null) {
    setSearch(searchInput);
    setTipo(tipoInput);
    setValor(valorNumerico != null ? String(valorNumerico) : "");
  }

  function handleClear() {
    setSearchInput("");
    setTipoInput("");
    setSearch("");
    setTipo("");
    setValor("");
  }

  if (loadingPessoa || !pessoa) return (
    <PageState
      loading={loadingPessoa}
      found={!!pessoa}
      notFoundMessage="Pessoa não encontrada."
      onBack={() => navigate("/pessoas")}
    />
  );

  return (
    <div className="flex flex-col gap-8 max-w-6xl w-full">

      <DetailHeader
        id={pessoa.id}
        title={pessoa.nome}
        fields={[{ label: "Idade", value: `${pessoa.idade} anos` }]}
        onBack={() => navigate("/pessoas")}
      />

      <Tabs
        defaultTab="informacoes"
        tabs={[
          {
            key: "informacoes",
            label: "Informações",
            content: (
              <div className="flex flex-col gap-4">
                <DetailsCard
                  items={[
                    { label: "ID", value: pessoa.id },
                    { label: "Nome", value: pessoa.nome },
                    { label: "Idade", value: `${pessoa.idade} anos` },
                  ]}
                />
                <SummaryCards
                  receitas={pessoa.totalReceitas}
                  despesas={pessoa.totalDespesas}
                  saldo={pessoa.saldo}
                />
              </div>
            ),
          },
          {
            key: "transacoes",
            label: "Transações",
            content: (
              <div className="flex flex-col gap-4">
                <TransacaoFiltros
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  tipoInput={tipoInput}
                  setTipoInput={setTipoInput}
                  onSearch={handleSearch}
                  onClear={handleClear}
                  hasFilters={!!(search || tipo || valor)}
                />

                {loadingTransacoes ? (
                  <p className="text-zinc-500 text-sm text-center py-8">Carregando...</p>
                ) : transacoes.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-8">Nenhuma transação encontrada.</p>
                ) : (
                  transacoes.map((t) => (
                    <div key={t.id} className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-4 flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <p className="text-white font-medium">{t.descricao}</p>
                        <div className="w-fit">
                            <TypeBadge tipo={t.tipo} />
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${t.tipo === "Receita" ? "text-emerald-400" : "text-red-400"}`}>
                        R$ {t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ),
          },
        ]}
      />

    </div>
  );
}