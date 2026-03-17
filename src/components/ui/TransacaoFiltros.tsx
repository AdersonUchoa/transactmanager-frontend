import { useCurrencyInput } from "../../hooks/UseCurrencyInput";

type Props = {
  searchInput: string;
  setSearchInput: (v: string) => void;
  tipoInput: string;
  setTipoInput: (v: string) => void;
  onSearch: (valorNumerico?: number | null) => void;
  onClear: () => void;
  hasFilters: boolean;
};

export default function TransacaoFiltros({
  searchInput,
  setSearchInput,
  tipoInput,
  setTipoInput,
  onSearch,
  onClear,
  hasFilters,
}: Props) {
  const { display, numericValue, handleChange, reset } = useCurrencyInput();

  function handleSearch() {
    onSearch(numericValue);
  }

  function handleClear() {
    reset();
    onClear();
  }

  return (
    <div className="flex gap-3 flex-wrap">

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

      <select
        value={tipoInput}
        onChange={(e) => setTipoInput(e.target.value)}
        className="appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
      >
        <option value="">Todos os tipos</option>
        <option value="Despesa">Despesa</option>
        <option value="Receita">Receita</option>
      </select>

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

      <button
        onClick={handleSearch}
        className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Pesquisar
      </button>

      {hasFilters && (
        <button
          onClick={handleClear}
          className="text-zinc-400 hover:text-white text-sm transition-colors"
        >
          Limpar
        </button>
      )}

    </div>
  );
}