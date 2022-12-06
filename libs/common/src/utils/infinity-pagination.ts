import { PaginationOptions } from './models/pagination.options'

export const infinityPagination = <T>(data: T[], options: PaginationOptions) => {
  return {
    data,
    page: options.page,
    limit: options.limit,
    hasNextPage: data.length > options.limit * options.page,
  }
}

