export interface CalculatedCondition {
  targetAmount?: number;
  monthlyAmount?: number;
  term?: number;
  savingsProduct?: SavingsProduct;
}

export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}
