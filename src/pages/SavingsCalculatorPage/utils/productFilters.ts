import { SavingsProduct } from '../api/getSavingsProducts';

export function isMonthlyAmountInRange(
  monthlyAmount: number
): (product: Pick<SavingsProduct, 'minMonthlyAmount' | 'maxMonthlyAmount'>) => boolean {
  return product => monthlyAmount >= product.minMonthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
}

export function isTermMatching(term: number): (product: Pick<SavingsProduct, 'availableTerms'>) => boolean {
  return product => term === product.availableTerms;
}
