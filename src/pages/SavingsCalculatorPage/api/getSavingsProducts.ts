import { queryOptions } from '@tanstack/react-query';
import { http } from 'tosslib';

export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}

const getSavingsProducts = async () => {
  return await http.get<SavingsProduct[]>('/api/savings-products');
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
