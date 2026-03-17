import { useNavigate } from "react-router-dom";
import type { Categoria } from "../../types/entities";
import { useEffect, useState } from "react";
import { categoriaService } from "../../services/categoriaService";
import { SearchBar } from "../../components/ui/SearchBar";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { CategoriaModal } from "../../components/ui/CategoriaModal";
import { ConfirmActionModal } from "../../components/ui/ConfirmActionModal";
import { formatBRL } from "../../utils/formatBRL";

export default function Categorias() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [pagination, setPagination] = useState<{
      pageIndex: number;
      totalPages: number;
      totalCount: number;
      pageSize: number;
      items: Categoria[];
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    } | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [finalidadeInput, setFinalidadeInput] = useState("");

  const [categoriaModalOpen, setCategoriaModalOpen] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<Categoria | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<Categoria | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, [page, search, finalidade]);

  async function fetchCategorias() {
    setLoading(true);
    try {
      const response = await categoriaService.getAll({ 
        page, 
        limit, 
        search,
        finalidade: finalidade as "Despesa" | "Receita" | "Ambas" | undefined || undefined || undefined});
      setPagination(response.data);
      setCategorias(response.data.items);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setPage(1);
    setSearch(searchInput);
    setFinalidade(finalidadeInput);
  }

  function handleClear() {
    setSearchInput("");
    setSearch("");
    setFinalidadeInput("");
    setFinalidade("");
  }

  function handleEditar(categoria: Categoria) {
    setCategoriaParaEditar(categoria);
    setCategoriaModalOpen(true);
  }

  function handleExcluir(categoria: Categoria) {
    setCategoriaParaExcluir(categoria);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!categoriaParaExcluir) return;
    setDeleting(true);
    try {
      await categoriaService.delete(categoriaParaExcluir.id);
      setConfirmOpen(false);
      setCategoriaParaExcluir(null);
      fetchCategorias();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Categorias</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Gerencie as categorias cadastradas no sistema.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onClear={handleClear}
          placeholder="Buscar pela descrição..."
          extra={
            <div className="relative">
              <select
                value={finalidadeInput}
                onChange={(e) => setFinalidadeInput(e.target.value)}
                className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 pr-8 text-sm text-white cursor-pointer outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Todas as finalidades</option>
                <option value="Receita">Receita</option>
                <option value="Despesa">Despesa</option>
                <option value="Ambas">Ambas</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          }
        />
        <Button
          label="+ Nova Categoria"
          onClick={() => {
            setCategoriaParaEditar(null);
            setCategoriaModalOpen(true);
          }}
        />
      </div>
      
      <DataTable 
        data={categorias}
        pagination={pagination}
        loading={loading}
        onPageChange={setPage}
        onRowClick={(categoria) => navigate(`/categorias/${categoria.id}`)}
        emptyMessage="Nenhuma categoria encontrada"
        columns={[
          { label: "ID", key: "id" },
          { label: "Descrição", key: "descricao" },
          { label: "Finalidade", key: "finalidade" },
          { label: "Receita", render: (c) => ( <span className="text-emerald-400 text-sm font-medium"> {formatBRL(c.totalReceitas)} </span>) },
          { label: "Despesa", render: (c) => ( <span className="text-red-400 text-sm font-medium"> {formatBRL(c.totalDespesas)} </span> ) },
          { label: "Saldo", render: (c) => ( <span className={`text-sm font-medium ${ c.saldo == null ? "text-zinc-400" : c.saldo >= 0 ? "text-blue-400" : "text-red-400"}`}> {formatBRL(c.saldo)} </span>) }
        ]}
        actions={(categoria) => (
          <>
            <Button label="Editar" variant="ghost" onClick={() => handleEditar(categoria)} />
            <Button label="Excluir" variant="danger" onClick={() => handleExcluir(categoria)} />
          </>
        )}
      />

      <CategoriaModal
        isOpen={categoriaModalOpen}
        categoria={categoriaParaEditar}
        onClose={() => setCategoriaModalOpen(false)}
        onSuccess={fetchCategorias}
      />

      <ConfirmActionModal
        isOpen={confirmOpen}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir "${categoriaParaExcluir?.descricao}"? Esta ação também removerá todas as transações associadas.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => {
          setConfirmOpen(false);
          setCategoriaParaExcluir(null);
        }}
      />
    </div>
  )
}