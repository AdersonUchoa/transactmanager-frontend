import { useEffect, useState } from "react";
import { useCurrencyInput } from "../../hooks/UseCurrencyInput";
import { Autocomplete } from "./Autocomplete";
import { pessoaService } from "../../services/pessoaService";
import { categoriaService } from "../../services/categoriaService";
import type { Categoria, Pessoa } from "../../types/entities";

type Props = {
  searchInput: string;
  setSearchInput: (v: string) => void;
  tipoInput: string;
  setTipoInput: (v: string) => void;
  onSearch: (valorNumerico?: number | null, pessoaId?: number | null, categoriaId?: number | null) => void;
  onClear: () => void;
  hasFilters: boolean;
  showPessoaFilter?: boolean;
  showCategoriaFilter?: boolean;
};

export default function TransacaoFiltros({
  searchInput,
  setSearchInput,
  tipoInput,
  setTipoInput,
  onSearch,
  onClear,
  hasFilters,
  showPessoaFilter = false,
  showCategoriaFilter = false,
}: Props) {
  const { display, numericValue, handleChange, reset } = useCurrencyInput();

  const [pessoaId, setPessoaId] = useState<number | null>(null);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    if (showPessoaFilter) {
      pessoaService.getAll({ page: 1, limit: 999 })
        .then((res) => setPessoas(res.data.items))
        .catch(console.error);
    }
  }, [showPessoaFilter]);

  useEffect(() => {
    if (showCategoriaFilter) {
      categoriaService.getAll({ page: 1, limit: 999 })
        .then((res) => setCategorias(res.data.items))
        .catch(console.error);
    }
  }, [showCategoriaFilter]);

  function handleSearch() {
    onSearch(numericValue, pessoaId, categoriaId);
  }

  function handleClear() {
    reset();
    setPessoaId(null);
    setCategoriaId(null);
    onClear();
  }

  const pessoaOptions = pessoas.map((p) => ({ id: p.id, label: p.nome }));
  const categoriaOptions = categorias.map((c) => ({
    id: c.id,
    label: `${c.descricao} — ${c.finalidade}`,
  }));

  return (
    <div className="flex gap-3 flex-wrap items-center">

      <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 flex-1 min-w-48">
        <input
          type="text"
          placeholder="Buscar por descrição..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-full"
        />
      </div>

      <div className="relative">
        <select
          value={tipoInput}
          onChange={(e) => setTipoInput(e.target.value)}
          className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 pr-8 text-sm text-white cursor-pointer outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Todos os tipos</option>
          <option value="Despesa">Despesa</option>
          <option value="Receita">Receita</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Valor exato..."
          value={display}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-32"
        />
        {display && (
          <button
            onClick={() => reset()}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs ml-1"
          >
            ✕
          </button>
        )}
      </div>

      {showPessoaFilter && (
        <div className="w-48">
          <Autocomplete
            options={pessoaOptions}
            value={pessoaId}
            onChange={setPessoaId}
            placeholder="Pessoa..."
          />
        </div>
      )}

      {showCategoriaFilter && (
        <div className="w-56">
          <Autocomplete
            options={categoriaOptions}
            value={categoriaId}
            onChange={setCategoriaId}
            placeholder="Categoria..."
          />
        </div>
      )}

      <button
        onClick={handleSearch}
        className="cursor-pointer bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Pesquisar
      </button>

      {hasFilters && (
        <button
          onClick={handleClear}
          className="cursor-pointer text-zinc-400 hover:text-white text-sm transition-colors"
        >
          Limpar
        </button>
      )}

    </div>
  );
}