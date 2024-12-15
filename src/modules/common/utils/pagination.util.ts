import { PaginationResult, PaginationOptions } from '../interfaces/pagination.interface';

export function createPaginationResult<T>(
  items: T[],
  total: number,
  options: PaginationOptions,
): PaginationResult<T> {
  const totalPages = Math.ceil(total / options.limit);
  
  return {
    items,
    total,
    page: options.page,
    limit: options.limit,
    totalPages,
  };
}