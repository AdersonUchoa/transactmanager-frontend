export interface PessoaFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CategoriaFilters {
  page?: number;
  limit?: number;
  search?: string;
  finalidade?: "Despesa" | "Receita" | "Ambas";
}

export interface TransacaoFilters {
  page?: number;
  limit?: number;
  search?: string;
  tipo?: "Despesa" | "Receita";
  pessoaId?: number;
  categoriaId?: number;
  valor?: number;
}

export interface TransacaoDetalhesFilters {
  page?: number;
  limit?: number;
  search?: string;
  tipo?: "Despesa" | "Receita";
  valor?: number;
}