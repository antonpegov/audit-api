import { PaginationOptions } from './models/pagination.options'

export const infinityPagination = <T>(data: T[], options: PaginationOptions) => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  }
}

