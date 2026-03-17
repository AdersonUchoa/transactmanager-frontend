import type { ApiResponse } from "../types/apiResponse";
import type { Transacao, TransacaoById } from "../types/entities";
import type { TransacaoDetalhesFilters, TransacaoFilters } from "../types/filters";
import type { PaginatedResult } from "../types/paginatedResult";
import type { CreateTransacaoRequest, UpdateTransacaoRequest } from "../types/requests";
import request, { toQueryString } from "./api";

const BASE = "/api/v1/transacoes";

export const transacaoService = {
  getAll: (filters?: TransacaoFilters) =>
    request<ApiResponse<PaginatedResult<Transacao>>>(`${BASE}${toQueryString({ ...filters })}`),

  getById: (id: number) =>
    request<ApiResponse<TransacaoById>>(`${BASE}/${id}`),

  getCount: () =>
    request<ApiResponse<number>>(`${BASE}/count`),

  getByPessoaId: (pessoaId: number, filters?: TransacaoDetalhesFilters) =>
    request<ApiResponse<PaginatedResult<Transacao>>>(`/api/v1/transacoes/pessoas/${pessoaId}${toQueryString({ ...filters })}`),

  getByCategoriaId: (categoriaId: number, filters?: TransacaoDetalhesFilters) =>
    request<ApiResponse<PaginatedResult<Transacao>>>(`/api/v1/transacoes/categorias/${categoriaId}${toQueryString({ ...filters })}`),

  create: (body: CreateTransacaoRequest) =>
    request<ApiResponse<Transacao>>(`${BASE}${toQueryString({ ...body })}`, {
      method: "POST",
    }),

  update: (id: number, body: UpdateTransacaoRequest) =>
    request<ApiResponse<Transacao>>(`${BASE}/${id}${toQueryString({ ...body })}`, {
      method: "PUT",
    }),

  delete: (id: number) =>
    request<ApiResponse<boolean>>(`${BASE}/${id}`, { method: "DELETE" }),
};