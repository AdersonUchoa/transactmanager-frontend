
import { useEffect, useState } from "react";
import type { Categoria } from "../../types/entities";
import { categoriaService } from "../../services/categoriaService";

type Finalidade = "Despesa" | "Receita" | "Ambas";

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoria?: Categoria | null;
}

export function CategoriaModal({ isOpen, onClose, onSuccess, categoria }: CategoriaModalProps) {
  const isEditing = !!categoria;

  const [descricao, setDescricao] = useState("");
  const [finalidade, setFinalidade] = useState<Finalidade | "">("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ descricao?: string; finalidade?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setDescricao(categoria?.descricao ?? "");
      setFinalidade(categoria?.finalidade ?? "");
      setErrors({});
    }
  }, [isOpen, categoria]);

  if (!isOpen) return null;

  function validate() {
    const newErrors: { descricao?: string; finalidade?: string } = {};
    if (!isEditing && !descricao.trim()) newErrors.descricao = "A descrição é obrigatória.";
    if (descricao.length > 400) newErrors.descricao = "A descrição deve conter no máximo 400 caracteres.";
    if (!isEditing && !finalidade) newErrors.finalidade = "A finalidade é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditing) {
        const body: { descricao?: string; finalidade?: Finalidade } = {};
        if (descricao.trim()) body.descricao = descricao.trim();
        if (finalidade) body.finalidade = finalidade as Finalidade;
        await categoriaService.update(categoria!.id, body);
      } else {
        await categoriaService.create({
          descricao: descricao.trim(),
          finalidade: finalidade as Finalidade,
        });
      }
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors";
  const labelClass = "text-xs text-zinc-400 font-medium uppercase tracking-wide";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-sm">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Descrição{" "}
              {isEditing && <span className="text-zinc-600 normal-case">(deixe em branco para manter)</span>}
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder={isEditing ? categoria?.descricao : "Ex: Alimentação"}
              className={inputClass}
            />
            {errors.descricao && <p className="text-xs text-red-400">{errors.descricao}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Finalidade{" "}
              {isEditing && <span className="text-zinc-600 normal-case">(deixe em branco para manter)</span>}
            </label>
            <select
              value={finalidade}
              onChange={(e) => setFinalidade(e.target.value as Finalidade | "")}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="" disabled>
                {isEditing ? `Atual: ${categoria?.finalidade}` : "Selecione a finalidade"}
              </option>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
              <option value="Ambas">Ambas</option>
            </select>
            {errors.finalidade && <p className="text-xs text-red-400">{errors.finalidade}</p>}
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
            {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Categoria"}
          </button>
        </div>
      </div>
    </div>
  );
}