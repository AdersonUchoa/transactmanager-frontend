import { useNavigate, useParams } from "react-router-dom";
import type { Categoria, Transacao } from "../../../types/entities";
import { useEffect, useState } from "react";
import { categoriaService } from "../../../services/categoriaService";
import { transacaoService } from "../../../services/transacaoService";
import { DetailHeader } from "../../../components/ui/DetailHeader";
import { DetailsCard } from "../../../components/ui/DetailsCard";
import { SummaryCards } from "../../../components/ui/SummaryCards";
import TransacaoFiltros from "../../../components/ui/TransacaoFiltros";
import { PageState } from "../../../components/ui/PageState";
import { Tabs } from "../../../components/ui/Tabs";
import { TypeBadge } from "../../../components/ui/TypeBadge";

export function CategoriaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loadingCategoria, setLoadingCategoria] = useState(true);
  const [loadingTransacoes, setLoadingTransacoes] = useState(true);

  const [search, setSearch] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [tipoInput, setTipoInput] = useState("");

  useEffect(() => {
    async function fetchCategoria() {
      setLoadingCategoria(true);
      try {
        const response = await categoriaService.getById(Number(id));
        setCategoria(response.data);
      } catch (error) {
        console.error("Erro ao buscar categoria:", error);
      } finally {
        setLoadingCategoria(false);
      }
    }
    fetchCategoria();
  }, [id]);

  useEffect(() => {
    async function fetchTransacoes() {
      setLoadingTransacoes(true);
      try {
        const response = await transacaoService.getByCategoriaId(Number(id), {
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

  if (loadingCategoria || !categoria) return (
    <PageState
      loading={loadingCategoria}
      found={!!categoria}
      notFoundMessage="Categoria não encontrada."
      onBack={() => navigate("/categorias")}
    />
  );

  return (
    <div className="flex flex-col gap-8 max-w-6xl w-full">

      <DetailHeader
        id={categoria.id}
        title={categoria.descricao}
        fields={[{ label: "Finalidade", value: categoria.finalidade }]}
        onBack={() => navigate("/categorias")}
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
                    { label: "ID", value: categoria.id },
                    { label: "Descrição", value: categoria.descricao },
                    { label: "Finalidade", value: categoria.finalidade },
                  ]}
                />
                <SummaryCards
                  receitas={categoria.totalReceitas}
                  despesas={categoria.totalDespesas}
                  saldo={categoria.saldo}
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