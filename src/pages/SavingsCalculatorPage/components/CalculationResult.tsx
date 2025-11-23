import { Suspense } from '@suspensive/react';
import { Assets, Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../api/getSavingsProducts';
import { formatAmount } from '../utils/formatAmount';
import { isMonthlyAmountInRange, isTermMatching } from '../utils/productFilters';
import { ProductList } from './ProductList';

interface Condition {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
}

interface CalculationResultProps {
  condition: Condition;
  selectedProduct: SavingsProduct;
}

export function CalculationResult({ condition, selectedProduct }: CalculationResultProps) {
  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatAmount(getExpectedAmount(condition, selectedProduct))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatAmount(getDifferenceFromTarget(condition, selectedProduct))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatAmount(roundToThousand(getRecommendedMonthlyAmount(condition, selectedProduct)))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <Suspense fallback={<ProductList.Fallback />}>
        <ProductList
          filter={products =>
            products
              .filter(isMonthlyAmountInRange(condition.monthlyAmount))
              .filter(isTermMatching(condition.term))
              .sort((a, b) => b.annualRate - a.annualRate)
              .slice(0, 2)
          }
          renderRight={product =>
            selectedProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null
          }
        />
      </Suspense>

      <Spacing size={40} />
    </>
  );
}

function getExpectedAmount(condition: Condition, savingsProduct: SavingsProduct) {
  return condition.monthlyAmount * condition.term * (1 + savingsProduct.annualRate * 0.5);
}

function getDifferenceFromTarget(condition: Condition, savingsProduct: SavingsProduct) {
  return condition.targetAmount - getExpectedAmount(condition, savingsProduct);
}

function getRecommendedMonthlyAmount(condition: Condition, savingsProduct: SavingsProduct) {
  return condition.targetAmount / (condition.term * (1 + savingsProduct.annualRate * 0.5));
}

function roundToThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}
