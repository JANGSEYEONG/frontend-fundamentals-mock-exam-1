import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { colors, isHttpError, ListRow } from 'tosslib';
import { getSavingsProductsQueryOptions } from '../api/getSavingsProducts';
import { SavingsProduct } from '../types';
import { formatAmount } from '../utils/formatAmount';
import { FilterCondition, OrderByCondition } from 'types';

interface SavingsProductListProps {
  filter?: Array<FilterCondition<SavingsProduct>>;
  orderBy?: Array<OrderByCondition<SavingsProduct>>;
  limit?: number;
  renderRight?: (savingsProdudct: SavingsProduct) => React.ReactNode;
  onClick?: (savingsProdudct: SavingsProduct) => void;
}
export function SavingsProductList({ filter, orderBy, limit, renderRight, onClick }: SavingsProductListProps) {
  return (
    <ErrorBoundary
      shouldCatch={isHttpError}
      fallback={
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="적금 상품을 불러오는 중 오류가 발생했어요." />} />
      }
    >
      <Suspense
        fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="적금 상품을 불러오는 중이에요." />} />}
      >
        <SuspenseQuery {...getSavingsProductsQueryOptions({ filter, orderBy, limit })}>
          {({ data: savingsProducts }) => {
            if (savingsProducts.length === 0) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 적금 상품이 없어요." />} />;
            }
            return savingsProducts.map(savingsProduct => (
              <ListRow
                key={savingsProduct.id}
                contents={
                  <ListRow.Texts
                    type="3RowTypeA"
                    top={savingsProduct.name}
                    topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                    middle={`연 이자율: ${savingsProduct.annualRate}%`}
                    middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                    bottom={`${formatAmount(savingsProduct.minMonthlyAmount)}원 ~ ${formatAmount(savingsProduct.maxMonthlyAmount)}원 | ${savingsProduct.availableTerms}개월`}
                    bottomProps={{ fontSize: 13, color: colors.grey600 }}
                  />
                }
                right={renderRight?.(savingsProduct)}
                onClick={() => onClick?.(savingsProduct)}
              />
            ));
          }}
        </SuspenseQuery>
      </Suspense>
    </ErrorBoundary>
  );
}
