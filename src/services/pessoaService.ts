import type { ApiResponse } from "../types/apiResponse";
import type { Pessoa } from "../types/entities";
import type { PessoaFilters } from "../types/filters";
import type { PaginatedResult } from "../types/paginatedResult";
import type { CreatePessoaRequest, UpdatePessoaRequest } from "../types/requests";
import request, { toQueryString } from "./api";

const BASE = "/api/v1/pessoas";

export const pessoaService = {
  getAll: (filters?: PessoaFilters) =>
    request<ApiResponse<PaginatedResult<Pessoa>>>(`${BASE}${toQueryString({ ...filters })}`),

  getById: (id: number) =>
    request<ApiResponse<Pessoa>>(`${BASE}/${id}`),

  getCount: () =>
    request<ApiResponse<number>>(`${BASE}/count`),

  create: (body: CreatePessoaRequest) =>
    request<ApiResponse<Pessoa>>(`${BASE}${toQueryString({ ...body })}`, {
      method: "POST",
    }),

  update: (id: number, body: UpdatePessoaRequest) =>
    request<ApiResponse<Pessoa>>(`${BASE}/${id}${toQueryString({ ...body })}`, {
      method: "PUT",
    }),

  delete: (id: number) =>
    request<ApiResponse<boolean>>(`${BASE}/${id}`, { method: "DELETE" }),
};