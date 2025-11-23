import { useSuspenseQuery } from '@tanstack/react-query';
import { getSavingsProductsQueryOptions } from '../api/getSavingsProducts';
import { Assets, colors, ListRow } from 'tosslib';

export function SavingProductItemList() {
  const { data: savingsProducts } = useSuspenseQuery(getSavingsProductsQueryOptions());

  return (
    <>
      {savingsProducts.map(savingProduct => {
        return (
          <ListRow
            key={savingProduct.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={savingProduct.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${savingProduct.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${formatAmount(savingProduct.minMonthlyAmount)}원 ~ ${formatAmount(savingProduct.maxMonthlyAmount)}원 | ${savingProduct.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={<Assets.Icon name="icon-check-circle-green" />}
            onClick={() => {}}
          />
        );
      })}
    </>
  );
}

const formatAmount = (
  value: number,
  options: {
    locales?: Intl.LocalesArgument;
  } = {
    locales: 'ko-KR',
  }
) => {
  return value.toLocaleString(options.locales);
};
