import { useEffect, useRef, useState } from "react";

interface AutocompleteOption {
  id: number;
  label: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Buscar...",
  disabled = false,
}: AutocompleteProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value) ?? null;

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option: AutocompleteOption) {
    onChange(option.id);
    setQuery("");
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => !disabled && setOpen(true)}
        className={`flex items-center justify-between bg-zinc-800 border rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${
          open ? "border-blue-500" : "border-zinc-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {open ? (
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="bg-transparent text-white placeholder-zinc-500 outline-none w-full"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={selected ? "text-white" : "text-zinc-500"}>
            {selected ? selected.label : placeholder}
          </span>
        )}
        {selected && !open && (
          <button onClick={handleClear} className="text-zinc-500 hover:text-zinc-300 transition-colors ml-2 text-xs">
            ✕
          </button>
        )}
        {!selected && !open && (
          <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {open && (
        <div className="absolute z-10 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-xs text-zinc-500 px-3 py-3">Nenhum resultado encontrado.</p>
          ) : (
            filtered.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-zinc-700 ${
                  option.id === value ? "text-blue-400" : "text-zinc-200"
                }`}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}