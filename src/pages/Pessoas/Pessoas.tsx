import { useEffect, useState } from "react";
import { pessoaService } from "../../services/pessoaService";
import type { Pessoa } from "../../types/entities";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/ui/DataTable";
import { SearchBar } from "../../components/ui/SearchBar";
import { PessoaModal } from "../../components/ui/PessoaModal";
import { Button } from "../../components/ui/Button";
import { ConfirmActionModal } from "../../components/ui/ConfirmActionModal";
import { formatBRL } from "../../utils/formatBRL";

export default function Pessoas() {
  const navigate = useNavigate();
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [pagination, setPagination] = useState<{
    pageIndex: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    items: Pessoa[];
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [pessoaModalOpen, setPessoaModalOpen] = useState(false);
  const [pessoaParaEditar, setPessoaParaEditar] = useState<Pessoa | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pessoaParaExcluir, setPessoaParaExcluir] = useState<Pessoa | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPessoas();
  }, [page, search]);

  async function fetchPessoas() {
    setLoading(true);
    try {
      const response = await pessoaService.getAll({ page, limit, search });
      setPagination(response.data);
      setPessoas(response.data.items);
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setPage(1);
    setSearch(searchInput);
  }

  function handleClear() {
    setSearchInput("");
    setSearch("");
  }

  function handleEditar(pessoa: Pessoa) {
    setPessoaParaEditar(pessoa);
    setPessoaModalOpen(true);
  }

  function handleExcluir(pessoa: Pessoa) {
    setPessoaParaExcluir(pessoa);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!pessoaParaExcluir) return;
    setDeleting(true);
    try {
      await pessoaService.delete(pessoaParaExcluir.id);
      setConfirmOpen(false);
      setPessoaParaExcluir(null);
      fetchPessoas();
    } catch (error) {
      console.error("Erro ao excluir pessoa:", error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-3xl font-bold text-white">Pessoas</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Gerencie as pessoas cadastradas no sistema.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onClear={handleClear}
          placeholder="Buscar por nome..."
        />
        <Button
          label="+ Nova Pessoa"
          onClick={() => {
            setPessoaParaEditar(null);
            setPessoaModalOpen(true);
          }}
        />
      </div>

      <DataTable
        data={pessoas}
        pagination={pagination}
        loading={loading}
        onPageChange={setPage}
        onRowClick={(pessoa) => navigate(`/pessoas/${pessoa.id}`)}
        emptyMessage="Nenhuma pessoa encontrada."
        columns={[
          { label: "ID", key: "id" },
          { label: "Nome", key: "nome" },
          { label: "Idade", render: (p) => `${p.idade} anos` },
          { label: "Receitas", render: (p) => ( <span className="text-emerald-400 text-sm font-medium"> {formatBRL(p.totalReceitas)} </span>) },
          { label: "Despesas", render: (p) => ( <span className="text-red-400 text-sm font-medium"> {formatBRL(p.totalDespesas)} </span> ) },
          { label: "Saldo", render: (p) => ( <span className={`text-sm font-medium ${ p.saldo == null ? "text-zinc-400" : p.saldo >= 0 ? "text-blue-400" : "text-red-400"}`}> {formatBRL(p.saldo)} </span>) }
        ]}
        actions={(pessoa) => (
          <>
            <Button label="Editar" variant="ghost" onClick={() => handleEditar(pessoa)} />
            <Button label="Excluir" variant="danger" onClick={() => handleExcluir(pessoa)} />
          </>
        )}
      />

      <PessoaModal
        isOpen={pessoaModalOpen}
        pessoa={pessoaParaEditar}
        onClose={() => setPessoaModalOpen(false)}
        onSuccess={fetchPessoas}
      />

      <ConfirmActionModal
        isOpen={confirmOpen}
        title="Excluir Pessoa"
        message={`Tem certeza que deseja excluir "${pessoaParaExcluir?.nome}"? Esta ação também removerá todas as transações associadas.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => {
          setConfirmOpen(false);
          setPessoaParaExcluir(null);
        }}
      />

    </div>
  );
}