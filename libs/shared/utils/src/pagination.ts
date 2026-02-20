export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export function calculatePagination(
  total: number,
  params: PaginationParams
): PaginationMeta {
  return {
    total,
    page: params.page,
    perPage: params.perPage,
    totalPages: Math.ceil(total / params.perPage),
  };
}
