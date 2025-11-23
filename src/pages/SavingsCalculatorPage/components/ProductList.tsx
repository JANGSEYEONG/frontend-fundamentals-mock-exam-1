import { useSuspenseQuery } from '@tanstack/react-query';
import { colors, ListRow } from 'tosslib';
import { getSavingsProductsQueryOptions } from '../api/getSavingsProducts';
import { formatAmount } from '../utils/formatAmount';
import { SavingsProduct } from '../types';

interface ProductListProps {
  filter?: (products: SavingsProduct[]) => SavingsProduct[];
  onClick?: (product: SavingsProduct) => void;
  renderRight?: (product: SavingsProduct) => React.ReactNode;
}

export function ProductList({ filter, onClick, renderRight }: ProductListProps) {
  const { data: savingsProducts } = useSuspenseQuery(getSavingsProductsQueryOptions());

  const filteredProducts = filter ? filter(savingsProducts) : savingsProducts;

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
            right={renderRight?.(savingProduct)}
            onClick={() => onClick?.(savingProduct)}
          />
        );
      })}
    </>
  );
}

ProductList.Fallback = function ProductListFallback() {
  return <div>적금 상품을 불러오는 중이에요...</div>;
};
