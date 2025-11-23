import { useSuspenseQuery } from '@tanstack/react-query';
import { getSavingsProductsQueryOptions, SavingsProduct } from '../api/getSavingsProducts';
import { Assets, colors, ListRow } from 'tosslib';
import { useMemo } from 'react';

interface SavingProductItemListProps {
  filterPredicates?: Array<(product: SavingsProduct) => boolean>;
  onClick?: (product: SavingsProduct) => void;
}

export function SavingProductItemList({ filterPredicates = [], onClick }: SavingProductItemListProps) {
  const { data: savingsProducts } = useSuspenseQuery(getSavingsProductsQueryOptions());

  const filteredProducts = useMemo(() => {
    if (filterPredicates.length === 0) {
      return savingsProducts;
    }
    return savingsProducts.filter(product => filterPredicates.every(predicate => predicate(product)));
  }, [savingsProducts, filterPredicates]);

  if (filteredProducts.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 적금 상품이 없어요." />} />;
  }

  return (
    <>
      {filteredProducts.map(savingProduct => {
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
            onClick={() => onClick?.(savingProduct)}
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
