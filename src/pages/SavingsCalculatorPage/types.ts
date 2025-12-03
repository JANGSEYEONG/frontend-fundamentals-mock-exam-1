export interface SavingsCondition {
  targetAmount?: number;
  monthlyAmount?: number;
  term?: number;
}

export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
}
