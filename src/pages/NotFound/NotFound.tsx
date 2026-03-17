import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <div className="flex flex-col items-center gap-2">
        <p className="text-7xl font-bold text-zinc-700">404</p>
        <h1 className="text-xl font-semibold text-white">Página não encontrada</h1>
        <p className="text-sm text-zinc-400 max-w-sm">
          A página que você está tentando acessar não existe ou foi removida.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-zinc-800"
        >
          ← Voltar
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 transition-colors px-4 py-2 rounded-lg"
        >
          Ir para o início
        </button>
      </div>
    </div>
  );
}