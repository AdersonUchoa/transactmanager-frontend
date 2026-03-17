import { Tooltip } from "./Tooltip";

interface PessoaIconProps {
  nome?: string;
  idade?: number;
}

interface CategoriaIconProps {
  descricao?: string;
  finalidade?: string;
}

export function PessoaIcon({ nome, idade }: PessoaIconProps) {
  return (
    <Tooltip
      content={
        nome ? (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-white">{nome}</p>
            {idade != null && <p className="text-xs text-zinc-400">{idade} anos</p>}
          </div>
        ) : (
          <p className="text-xs text-zinc-400">Sem informações</p>
        )
      }
    >
      <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-xs font-semibold cursor-default select-none">
        {nome?.[0]?.toUpperCase() ?? "P"}
      </div>
    </Tooltip>
  );
}

export function CategoriaIcon({ descricao, finalidade }: CategoriaIconProps) {
  return (
    <Tooltip
      content={
        descricao ? (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-white">{descricao}</p>
            {finalidade && <p className="text-xs text-zinc-400">Finalidade: {finalidade}</p>}
          </div>
        ) : (
          <p className="text-xs text-zinc-400">Sem informações</p>
        )
      }
    >
      <div className="w-7 h-7 rounded-md bg-violet-900 flex items-center justify-center text-violet-300 text-xs font-semibold cursor-default select-none">
        C
      </div>
    </Tooltip>
  );
}