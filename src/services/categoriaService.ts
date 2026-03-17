import type { ApiResponse } from "../types/apiResponse";
import type { Categoria } from "../types/entities";
import type { CategoriaFilters } from "../types/filters";
import type { PaginatedResult } from "../types/paginatedResult";
import type { CreateCategoriaRequest, UpdateCategoriaRequest } from "../types/requests";
import request, { toQueryString } from "./api";

const BASE = "/api/v1/categorias";

export const categoriaService = {
  getAll: (filters?: CategoriaFilters) =>
    request<ApiResponse<PaginatedResult<Categoria>>>(`${BASE}${toQueryString({ ...filters })}`),

  getById: (id: number) =>
    request<ApiResponse<Categoria>>(`${BASE}/${id}`),

  getCount: () =>
    request<ApiResponse<number>>(`${BASE}/count`),

  create: (body: CreateCategoriaRequest) =>
    request<ApiResponse<Categoria>>(`${BASE}${toQueryString({ ...body })}`, {
      method: "POST",
    }),

  update: (id: number, body: UpdateCategoriaRequest) =>
    request<ApiResponse<Categoria>>(`${BASE}/${id}${toQueryString({ ...body })}`, {
      method: "PUT",
    }),

  delete: (id: number) =>
    request<ApiResponse<boolean>>(`${BASE}/${id}`, { method: "DELETE" }),
};