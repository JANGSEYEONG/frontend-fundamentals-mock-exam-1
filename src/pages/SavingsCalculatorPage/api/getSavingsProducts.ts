import { queryOptions } from '@tanstack/react-query';
import { isNil, orderBy as sortBy } from 'es-toolkit';
import { http } from 'tosslib';
import { SavingsProduct } from '../types';
import { FilterCondition, OrderByCondition } from 'types';

interface GetSavingsProductsOptions {
  filter?: Array<FilterCondition<SavingsProduct>>;
  orderBy?: Array<OrderByCondition<SavingsProduct>>;
  limit?: number;
}

type GetSavingsProductsResponse = SavingsProduct[];

const getSavingsProducts = async () => {
  return await http.get<GetSavingsProductsResponse>('/api/savings-products');
};

export const getSavingsProductsQueryOptions = ({ filter, orderBy, limit }: GetSavingsProductsOptions = {}) =>
  queryOptions({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
    select: (data: SavingsProduct[]) => {
      let result = [...data];

      if (filter && filter.length > 0) {
        result = result.filter(item => {
          return filter.every(condition => {
            const fieldValue = item[condition.field];

            if (isNil(condition.value)) {
              return true;
            }

            switch (condition.operator) {
              case 'eq':
                return fieldValue === condition.value;
              case 'lte':
                return fieldValue <= condition.value;
              case 'gte':
                return fieldValue >= condition.value;
              default:
                return true;
            }
          });
        });
      }

      if (orderBy && orderBy.length > 0) {
        result = sortBy(
          result,
          orderBy.map(o => o.field),
          orderBy.map(o => o.direction)
        );
      }

      if (limit !== undefined) {
        result = result.slice(0, limit);
      }

      return result;
    },
  });
