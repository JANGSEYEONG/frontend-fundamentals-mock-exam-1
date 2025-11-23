import { Assets, Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../api/getSavingsProducts';
import { formatAmount } from '../utils/formatAmount';
import { ProductList } from './ProductList';
import { isMonthlyAmountInRange, isTermMatching } from '../utils/productFilters';
import { ConditionFormData } from './ConditionForm';
import { Suspense } from '@suspensive/react';

interface CalculationResultProps {
  condition: Required<ConditionFormData>;
  savingsProduct: SavingsProduct;
}
export function CalculationResult({ condition, savingsProduct }: CalculationResultProps) {
  const 예상_수익_금액 = condition.monthlyAmount * condition.term * (1 + savingsProduct.annualRate * 0.5);
  const 목표_금액과의_차이 = condition.targetAmount - 예상_수익_금액;
  const 추천_월_납입_금액 = condition.targetAmount / (condition.term * (1 + savingsProduct.annualRate * 0.5));
  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatAmount(예상_수익_금액)}원`}
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
            bottom={`${formatAmount(목표_금액과의_차이)}원`}
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
            bottom={`${formatAmount(Math.round(추천_월_납입_금액 / 1000) * 1000)}원`}
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
            savingsProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null
          }
        />
      </Suspense>

      <Spacing size={40} />
    </>
  );
}
