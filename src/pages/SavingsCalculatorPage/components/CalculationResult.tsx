import { isNil, isNotNil } from 'es-toolkit';
import { colors, ListRow } from 'tosslib';
import { SavingsCondition, SavingsProduct } from '../types';
import { formatAmount } from '../utils/formatAmount';

interface CalculationResultProps {
  savingsProduct?: SavingsProduct;
  savingsCondition: SavingsCondition;
}

export function CalculationResult({ savingsCondition, savingsProduct }: CalculationResultProps) {
  if (!checkRequiredCondition(savingsCondition)) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건을 모두 입력해주세요." />} />;
  }

  if (isNil(savingsProduct)) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatAmount(getExpectedAmount(savingsProduct, savingsCondition))}원`}
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
            bottom={`${formatAmount(getDifferenceFromTarget(savingsProduct, savingsCondition))}원`}
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
            bottom={`${formatAmount(roundToThousand(getRecommendedMonthlyAmount(savingsProduct, savingsCondition)))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}

function checkRequiredCondition(condition: SavingsCondition): condition is Required<SavingsCondition> {
  return isNotNil(condition.targetAmount) && isNotNil(condition.monthlyAmount) && isNotNil(condition.term);
}

function getExpectedAmount(product: SavingsProduct, condition: Required<SavingsCondition>) {
  return condition.monthlyAmount * condition.term * (1 + product.annualRate * 0.5);
}

function getDifferenceFromTarget(product: SavingsProduct, condition: Required<SavingsCondition>) {
  return condition.targetAmount - getExpectedAmount(product, condition);
}

function getRecommendedMonthlyAmount(product: SavingsProduct, condition: Required<SavingsCondition>) {
  return condition.targetAmount / (condition.term * (1 + product.annualRate * 0.5));
}

function roundToThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}
