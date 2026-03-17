export interface PaginatedResult<T> {
  pageIndex: number
  totalPages: number
  totalCount: number
  pageSize: number
  items: T[]
  hasPreviousPage: boolean
  hasNextPage: boolean
}