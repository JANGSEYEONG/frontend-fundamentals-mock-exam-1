import { Suspense } from '@suspensive/react';
import { useState } from 'react';
import { Assets, Border, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { type SavingsProduct } from './api/getSavingsProducts';
import { CalculationResult } from './components/CalculationResult';
import { ConditionForm, ConditionFormData } from './components/ConditionForm';
import { ProductList } from './components/ProductList';
import { isMonthlyAmountInRange, isTermMatching } from './utils/productFilters';

export function SavingsCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const [condition, setCondition] = useState<ConditionFormData>({
    targetAmount: undefined,
    monthlyAmount: undefined,
    term: 12,
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <ConditionForm values={condition} onValuesChange={data => setCondition(data)} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {(() => {
        switch (selectedTab) {
          case 'products':
            if (condition.monthlyAmount == null || condition.term == null) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건을 모두 입력해주세요." />} />;
            }
            return (
              <Suspense fallback={<ProductList.Fallback />}>
                <ProductList
                  filter={products =>
                    products
                      .filter(isMonthlyAmountInRange(Number(condition.monthlyAmount)))
                      .filter(isTermMatching(Number(condition.term)))
                  }
                  renderRight={product =>
                    selectedProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null
                  }
                  onClick={product => setSelectedProduct(product)}
                />
              </Suspense>
            );
          case 'results':
            if (!selectedProduct) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
            }
            if (!condition.monthlyAmount || !condition.term || !condition.targetAmount) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건을 모두 입력해주세요." />} />;
            }
            return (
              <CalculationResult
                condition={{
                  monthlyAmount: Number(condition.monthlyAmount),
                  term: Number(condition.term),
                  targetAmount: Number(condition.targetAmount),
                }}
                selectedProduct={selectedProduct}
              />
            );
        }
      })()}

      <Spacing size={8} />
    </>
  );
}
