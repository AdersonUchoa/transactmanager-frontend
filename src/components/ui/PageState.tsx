interface PageStateProps {
  loading: boolean;
  found: boolean;
  notFoundMessage?: string;
  onBack: () => void;
}

export function PageState({
  loading,
  found,
  notFoundMessage = "Registro não encontrado.",
  onBack,
}: PageStateProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!found) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-5">
        <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-white font-medium text-sm">Não encontrado(a).</p>
          <p className="text-zinc-500 text-sm">{notFoundMessage}</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors px-4 py-2 rounded-lg"
        >
          ← Voltar
        </button>
      </div>
    );
  }

  return null;
}