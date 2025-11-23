import { queryOptions } from '@tanstack/react-query';
import { http } from 'tosslib';
import { SavingsProduct } from '../types';

type GetSavingsProductsResponse = SavingsProduct[];

const getSavingsProducts = async () => {
  return await http.get<GetSavingsProductsResponse>('/api/savings-products');
};

export const getSavingsProductsQueryOptions = () =>
  queryOptions({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
  });

// // API 오류 캐치하기
// try {
//   await http.post(...);
// } catch (e) {
//   if (isHttpError(e)) {
//     console.log(e.message);
//   }
// }
