import { useEffect, useState } from "react";
import type { Categoria, Pessoa, Transacao } from "../../types/entities";
import { transacaoService } from "../../services/transacaoService";
import { pessoaService } from "../../services/pessoaService";
import { categoriaService } from "../../services/categoriaService";
import { Autocomplete } from "./Autocomplete";
import { useCurrencyInput } from "../../hooks/UseCurrencyInput";

type Tipo = "Despesa" | "Receita";

interface TransacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transacao?: Transacao | null;
}

export function TransacaoModal({ isOpen, onClose, onSuccess, transacao }: TransacaoModalProps) {
  const isEditing = !!transacao;

  const [descricao, setDescricao] = useState("");
  const { display: valorDisplay, numericValue: valorNumerico, handleChange: handleValorChange, reset: resetValor } = useCurrencyInput();
  const [tipo, setTipo] = useState<Tipo | "">("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [pessoaId, setPessoaId] = useState<number | null>(null);

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    descricao?: string;
    valor?: string;
    tipo?: string;
    categoriaId?: string;
    pessoaId?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setDescricao(transacao?.descricao ?? "");
      resetValor(transacao?.valor ?? null);
      setTipo(transacao?.tipo ?? "");
      setCategoriaId(transacao?.categoriaId ?? null);
      setPessoaId(transacao?.pessoaId ?? null);
      setErrors({});
      setServerError(null);
      fetchSelectData();
    }
  }, [isOpen, transacao]);

  async function fetchSelectData() {
    setLoadingData(true);
    try {
      const [pessoasRes, categoriasRes] = await Promise.all([
        pessoaService.getAll({ page: 1, limit: 999 }),
        categoriaService.getAll({ page: 1, limit: 999 }),
      ]);
      setPessoas(pessoasRes.data.items);
      setCategorias(categoriasRes.data.items);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoadingData(false);
    }
  }

  if (!isOpen) return null;

  function validate() {
    const newErrors: typeof errors = {};
    if (!isEditing) {
      if (!descricao.trim()) newErrors.descricao = "A descrição é obrigatória.";
      if (valorNumerico == null) newErrors.valor = "O valor é obrigatório.";
      if (!tipo) newErrors.tipo = "O tipo é obrigatório.";
      if (!categoriaId) newErrors.categoriaId = "A categoria é obrigatória.";
      if (!pessoaId) newErrors.pessoaId = "A pessoa é obrigatória.";
    }
    if (descricao.length > 400) newErrors.descricao = "A descrição deve conter no máximo 400 caracteres.";
    if (valorNumerico != null && valorNumerico < 0) newErrors.valor = "O valor deve ser maior que 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setServerError(null);
    try {
      if (isEditing) {
        const body: {
          descricao?: string;
          valor?: number;
          tipo?: Tipo;
          categoriaId?: number;
          pessoaId?: number;
        } = {};
        if (descricao.trim()) body.descricao = descricao.trim();
        if (valorNumerico != null) body.valor = valorNumerico;
        if (tipo) body.tipo = tipo as Tipo;
        if (categoriaId) body.categoriaId = categoriaId;
        if (pessoaId) body.pessoaId = pessoaId;
        await transacaoService.update(transacao!.id, body);
      } else {
        await transacaoService.create({
          descricao: descricao.trim(),
          valor: valorNumerico!,
          tipo: tipo as Tipo,
          categoriaId: categoriaId!,
          pessoaId: pessoaId!,
        });
      }

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      setServerError(error instanceof Error ? error.message : "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors";
  const labelClass = "text-xs text-zinc-400 font-medium uppercase tracking-wide";
  const editHint = isEditing ? (
    <span className="text-zinc-600 normal-case">(deixe em branco para manter)</span>
  ) : null;

  const pessoaOptions = pessoas.map((p) => ({ id: p.id, label: p.nome }));
  const categoriaOptions = categorias.map((c) => ({
    id: c.id,
    label: `${c.descricao} — ${c.finalidade}`,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </h2>
          <button onClick={onClose} className="cursor-pointer text-zinc-500 hover:text-white transition-colors text-sm">
            ✕
          </button>
        </div>

        {loadingData ? (
          <p className="text-sm text-zinc-500 text-center py-6">Carregando dados...</p>
        ) : (
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Descrição {editHint}</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder={isEditing ? transacao?.descricao : "Ex: Compra no mercado"}
                className={inputClass}
              />
              {errors.descricao && <p className="text-xs text-red-400">{errors.descricao}</p>}
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className={labelClass}>Valor {editHint}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={valorDisplay}
                  onChange={handleValorChange}
                  placeholder={isEditing ? `R$ ${Number(transacao?.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "R$ 0,00"}
                  className={inputClass}
                />
                {errors.valor && <p className="text-xs text-red-400">{errors.valor}</p>}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className={labelClass}>Tipo {editHint}</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as Tipo | "")}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="" disabled>
                    {isEditing ? `Atual: ${transacao?.tipo}` : "Selecione"}
                  </option>
                  <option value="Receita">Receita</option>
                  <option value="Despesa">Despesa</option>
                </select>
                {errors.tipo && <p className="text-xs text-red-400">{errors.tipo}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Pessoa {editHint}</label>
              <Autocomplete
                options={pessoaOptions}
                value={pessoaId}
                onChange={setPessoaId}
                placeholder={isEditing ? `Atual: ID #${transacao?.pessoaId}` : "Buscar pessoa..."}
              />
              {errors.pessoaId && <p className="text-xs text-red-400">{errors.pessoaId}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Categoria {editHint}</label>
              <Autocomplete
                options={categoriaOptions}
                value={categoriaId}
                onChange={setCategoriaId}
                placeholder={isEditing ? `Atual: ID #${transacao?.categoriaId}` : "Buscar categoria..."}
              />
              {errors.categoriaId && <p className="text-xs text-red-400">{errors.categoriaId}</p>}
            </div>

          </div>
        )}

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <p className="text-xs text-red-400">{serverError}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || loadingData}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
          >
            {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Transação"}
          </button>
        </div>
      </div>
    </div>
  );
}