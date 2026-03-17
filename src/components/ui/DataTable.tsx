interface Column<T> {
  label: string;
  key?: keyof T;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface PaginationInfo {
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination: PaginationInfo | null;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  pagination,
  loading = false,
  onPageChange,
  onRowClick,
  actions,
  emptyMessage = "Nenhum registro encontrado.",
}: DataTableProps<T>) {
  const currentPage = pagination?.pageIndex ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalCount = pagination?.totalCount ?? 0;
  const pageSize = pagination?.pageSize ?? 10;

  const from = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-800/50">
            {columns.map((col) => (
              <th
                key={String(col.label)}
                className={`px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider ${
                  col.align === "center" ? "text-center" :
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center text-zinc-500 py-10"
              >
                Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center text-zinc-500 py-10"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-zinc-800 last:border-0 transition-colors ${
                  onRowClick ? "cursor-pointer hover:bg-zinc-800/50" : ""
                }`}
              >
                {columns.map((col) => (
                  <td key={String(col.label)} className={`px-6 py-4 text-zinc-200 ${
                    col.align === "center" ? "text-center" :
                    col.align === "right" ? "text-right" : "text-left"
                  }`}>
                    {col.render
                      ? col.render(row)
                      : col.key !== undefined
                      ? String(row[col.key] ?? "")
                      : null}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-800/20">
        <span className="text-xs text-zinc-500">
          {totalCount === 0 ? "0 registros" : `${from}–${to} de ${totalCount}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!pagination?.hasPreviousPage}
            className="px-3 py-1.5 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-md text-xs transition-colors ${
                p === currentPage
                  ? "bg-blue-600 text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!pagination?.hasNextPage}
            className="px-3 py-1.5 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}