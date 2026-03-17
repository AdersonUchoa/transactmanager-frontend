export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  transacoes: Transacao[];
  totalReceitas?: number;
  totalDespesas?: number;
  saldo?: number;
}

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: "Despesa" | "Receita" | "Ambas";
  totalReceitas?: number;
  totalDespesas?: number;
  saldo?: number;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: "Despesa" | "Receita";
  categoriaId: number;
  pessoaId: number;
  categoria?: {
    descricao: string;
    finalidade: string;
  };
  pessoa?: {
    nome: string;
    idade: number;
  };
}

export interface TransacaoById {
  id: number;
  descricao: string;
  valor: number;
  tipo: "Despesa" | "Receita";
  categoriaId: number;
  pessoaId: number;
  pessoa: {
    id: number;
    nome: string;
    idade: number;
  };
  categoria: {
    id: number;
    descricao: string;
    finalidade: string;
  };
}