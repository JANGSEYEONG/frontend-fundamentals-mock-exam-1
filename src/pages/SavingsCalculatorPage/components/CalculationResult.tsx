import { isNil, isNotNil } from 'es-toolkit';
import { colors, ListRow } from 'tosslib';
import { Condition } from '../types';
import { formatAmount } from '../utils/formatAmount';

interface CalculationResultProps {
  condition: Condition;
}

export function CalculationResult({ condition }: CalculationResultProps) {
  if (!checkRequiredCondition(condition)) {
    if (isNil(condition.savingsProduct)) {
      return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
    }
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건을 모두 입력해주세요." />} />;
  }

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatAmount(getExpectedAmount(condition))}원`}
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
            bottom={`${formatAmount(getDifferenceFromTarget(condition))}원`}
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
            bottom={`${formatAmount(roundToThousand(getRecommendedMonthlyAmount(condition)))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}

function checkRequiredCondition(condition: Condition): condition is Required<Condition> {
  return (
    isNotNil(condition.targetAmount) &&
    isNotNil(condition.monthlyAmount) &&
    isNotNil(condition.term) &&
    isNotNil(condition.savingsProduct)
  );
}

function getExpectedAmount(condition: Required<Condition>) {
  return condition.monthlyAmount * condition.term * (1 + condition.savingsProduct.annualRate * 0.5);
}

function getDifferenceFromTarget(condition: Required<Condition>) {
  return condition.targetAmount - getExpectedAmount(condition);
}

function getRecommendedMonthlyAmount(condition: Required<Condition>) {
  return condition.targetAmount / (condition.term * (1 + condition.savingsProduct.annualRate * 0.5));
}

function roundToThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}
