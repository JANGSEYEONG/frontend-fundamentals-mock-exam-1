import { ErrorBoundary, Suspense } from '@suspensive/react';
import { useState } from 'react';
import { Assets, Border, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { type SavingsProduct } from './api/getSavingsProducts';
import { CalculationResult } from './components/CalculationResult';
import { ProductList } from './components/ProductList';
import { isMonthlyAmountInRange, isTermMatching } from './utils/productFilters';

export interface SearchFormData {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
}

export function SavingsCalculatorPage() {
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({
    term: 12,
  });

  const [selectedTab, setSelectedTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={searchFormData.targetAmount}
        onChange={e => setSearchFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={searchFormData.monthlyAmount}
        onChange={e => setSearchFormData(prev => ({ ...prev, monthlyAmount: e.target.value }))}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={searchFormData.term}
        onChange={term => setSearchFormData(prev => ({ ...prev, term }))}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

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
            return (
              <ErrorBoundary fallback={<div>적금 상품을 불러오는 중 오류가 발생했어요.</div>}>
                <Suspense fallback={<div>적금 상품을 불러오는 중이에요...</div>}>
                  <ProductList
                    filter={products =>
                      products
                        .filter(isMonthlyAmountInRange(Number(searchFormData.monthlyAmount)))
                        .filter(isTermMatching(searchFormData.term))
                    }
                    renderRight={product =>
                      selectedProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null
                    }
                    onClick={product => setSelectedProduct(product)}
                  />
                </Suspense>
              </ErrorBoundary>
            );
          case 'results':
            if (!selectedProduct) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
            }
            return <CalculationResult searchFormData={searchFormData} savingsProduct={selectedProduct} />;
        }
      })()}

      <Spacing size={8} />
    </>
  );
}
