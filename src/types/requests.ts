export interface CreatePessoaRequest {
  nome: string;
  idade: number;
}

export interface UpdatePessoaRequest {
  nome?: string;
  idade?: number;
}

export interface CreateCategoriaRequest {
  descricao: string;
  finalidade: "Despesa" | "Receita" | "Ambas";
}

export interface UpdateCategoriaRequest {
  descricao?: string;
  finalidade?: "Despesa" | "Receita" | "Ambas";
}

export interface CreateTransacaoRequest {
  descricao: string;
  valor: number;
  tipo: "Despesa" | "Receita";
  categoriaId: number;
  pessoaId: number;
}

export interface UpdateTransacaoRequest {
  descricao?: string;
  valor?: number;
  tipo?: "Despesa" | "Receita";
  categoriaId?: number;
  pessoaId?: number;
}
