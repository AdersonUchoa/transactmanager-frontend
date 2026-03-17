import { useEffect, useState } from "react";
import type { Pessoa } from "../../types/entities";
import { pessoaService } from "../../services/pessoaService";

interface PessoaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pessoa?: Pessoa | null;
}

export function PessoaModal({ isOpen, onClose, onSuccess, pessoa }: PessoaModalProps) {
  const isEditing = !!pessoa;

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nome?: string; idade?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setNome(pessoa?.nome ?? "");
      setIdade(pessoa?.idade != null ? String(pessoa.idade) : "");
      setErrors({});
    }
  }, [isOpen, pessoa]);

  if (!isOpen) return null;

  function validate() {
    const newErrors: { nome?: string; idade?: string } = {};
    if (!isEditing) {
      if (!nome.trim()) newErrors.nome = "O nome é obrigatório.";
    }
    if (nome.length > 200) newErrors.nome = "O nome deve conter no máximo 200 caracteres.";
    if (idade !== "" && Number(idade) < 0) newErrors.idade = "A idade não pode ser menor que 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditing) {
        const body: { nome?: string; idade?: number } = {};
        if (nome.trim()) body.nome = nome.trim();
        if (idade !== "") body.idade = Number(idade);
        await pessoaService.update(pessoa!.id, body);
      } else {
        await pessoaService.create({ nome: nome.trim(), idade: Number(idade) });
      }
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Pessoa" : "Nova Pessoa"}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
              Nome {isEditing && <span className="text-zinc-600 normal-case">(deixe em branco para manter)</span>}
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={isEditing ? pessoa?.nome : "Ex: João Silva"}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
            />
            {errors.nome && <p className="text-xs text-red-400">{errors.nome}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
              Idade {isEditing && <span className="text-zinc-600 normal-case">(deixe em branco para manter)</span>}
            </label>
            <input
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              placeholder={isEditing ? String(pessoa?.idade) : "Ex: 29"}
              min={0}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
            />
            {errors.idade && <p className="text-xs text-red-400">{errors.idade}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
          >
            {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Pessoa"}
          </button>
        </div>
      </div>
    </div>
  );
}