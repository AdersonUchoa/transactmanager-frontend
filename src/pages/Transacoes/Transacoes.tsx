import { useNavigate } from "react-router-dom";
import type { Transacao } from "../../types/entities";
import { useEffect, useState } from "react";
import { transacaoService } from "../../services/transacaoService";
import { DataTable } from "../../components/ui/DataTable";
import { TransacaoModal } from "../../components/ui/TransacaoModal";
import TransacaoFiltros from "../../components/ui/TransacaoFiltros";
import { Button } from "../../components/ui/Button";
import { ConfirmActionModal } from "../../components/ui/ConfirmActionModal";
import { CategoriaIcon, PessoaIcon } from "../../components/ui/Icons";
import { TypeBadge } from "../../components/ui/TypeBadge";

export default function Transacoes() {
  const navigate = useNavigate();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [pagination, setPagination] = useState<{
    pageIndex: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    items: Transacao[];
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [tipoInput, setTipoInput] = useState("");

  const [transacaoModalOpen, setTransacaoModalOpen] = useState(false);
  const [transacaoParaEditar, setTransacaoParaEditar] = useState<Transacao | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [transacaoParaExcluir, setTransacaoParaExcluir] = useState<Transacao | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTransacoes();
  }, [page, search, tipo, valor]);

  async function fetchTransacoes() {
    setLoading(true);
    try {
      const response = await transacaoService.getAll({
        page,
        limit,
        search: search || undefined,
        tipo: tipo as "Despesa" | "Receita" | undefined || undefined,
        valor: valor ? Number(valor) : undefined,
      });
      setPagination(response.data);
      setTransacoes(response.data.items);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(valorNumerico?: number | null) {
    setPage(1);
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

  function handleEdit(transacao: Transacao) {
    setTransacaoParaEditar(transacao);
    setTransacaoModalOpen(true);
  }

  function handleDelete(transacao: Transacao) {
    setTransacaoParaExcluir(transacao);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!transacaoParaExcluir) return;
    setDeleting(true);
    try {
      await transacaoService.delete(transacaoParaExcluir.id);
      setConfirmOpen(false);
      setTransacaoParaExcluir(null);
      fetchTransacoes();
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Transações</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Gerencie as transações cadastradas no sistema.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <TransacaoFiltros
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          tipoInput={tipoInput}
          setTipoInput={setTipoInput}
          onSearch={handleSearch}
          onClear={handleClear}
          hasFilters={!!(search || tipo || valor)}
        />
        <Button
          label="+ Nova Transação"
          onClick={() => {
            setTransacaoParaEditar(null);
            setTransacaoModalOpen(true);
          }}
        />
      </div>

      <DataTable
        data={transacoes}
        pagination={pagination}
        loading={loading}
        onPageChange={setPage}
        onRowClick={(transacao) => navigate(`/transacoes/${transacao.id}`)}
        columns={[
          { label: "ID", key: "id" },
          { label: "Descrição", key: "descricao" },
          { label: "Valor", render: (t) => `R$ ${Number(t.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
          { label: "Tipo", render: (t) => <TypeBadge tipo={t.tipo} /> },
          { label: "Pessoa", align: "center", render: (t) => <PessoaIcon nome={t.pessoa?.nome} idade={t.pessoa?.idade} /> },
          { label: "Categoria", align: "center", render: (t) => <CategoriaIcon descricao={t.categoria?.descricao} finalidade={t.categoria?.finalidade}/> }
        ]}
        actions={(transacao) => (
          <>
            <Button label="Editar" variant="ghost" onClick={() => handleEdit(transacao)} />
            <Button label="Excluir" variant="danger" onClick={() => handleDelete(transacao)} />
          </>
        )}
      />

      <TransacaoModal
        isOpen={transacaoModalOpen}
        transacao={transacaoParaEditar}
        onClose={() => setTransacaoModalOpen(false)}
        onSuccess={fetchTransacoes}
      />

      <ConfirmActionModal
        isOpen={confirmOpen}
        title="Excluir Transação"
        message={`Tem certeza que deseja excluir "${transacaoParaExcluir?.descricao}"? Essa operação é irreversível.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => {
          setConfirmOpen(false);
          setTransacaoParaExcluir(null);
        }}
      />
    </div>
  );
}