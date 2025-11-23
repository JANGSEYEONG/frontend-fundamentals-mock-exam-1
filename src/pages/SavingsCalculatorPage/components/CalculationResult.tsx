import { Border, colors, ListRow, Spacing } from 'tosslib';
import { CalculatorCondition } from '../types';
import { formatAmount } from '../utils/formatAmount';

interface CalculationResultProps {
  condition: CalculatorCondition;
  extra?: React.ReactNode;
}

export function CalculationResult({ condition, extra }: CalculationResultProps) {
  if (!checkCompleteCondition(condition)) {
    if (!condition.savingsProduct) {
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
      {extra && (
        <>
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          {extra}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}

interface CompleteCondition {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
  savingsProduct: NonNullable<CalculatorCondition['savingsProduct']>;
}

function checkCompleteCondition(condition: CalculatorCondition): condition is CompleteCondition {
  return Boolean(condition.targetAmount && condition.monthlyAmount && condition.term && condition.savingsProduct);
}

function getExpectedAmount(condition: CompleteCondition) {
  return condition.monthlyAmount * condition.term * (1 + condition.savingsProduct.annualRate * 0.5);
}

function getDifferenceFromTarget(condition: CompleteCondition) {
  return condition.targetAmount - getExpectedAmount(condition);
}

function getRecommendedMonthlyAmount(condition: CompleteCondition) {
  return condition.targetAmount / (condition.term * (1 + condition.savingsProduct.annualRate * 0.5));
}

function roundToThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}
