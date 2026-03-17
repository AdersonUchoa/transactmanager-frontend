interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  placeholder?: string;
  extra?: React.ReactNode;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Buscar...",
  extra,
}: SearchBarProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 flex-1 max-w-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-zinc-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-full"
        />
        {value && (
          <button
            onClick={onClear}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {extra}

      <button
        onClick={onSearch}
        className="bg-zinc-700 hover:bg-zinc-600 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
      >
        Pesquisar
      </button>
    </div>
  );
}