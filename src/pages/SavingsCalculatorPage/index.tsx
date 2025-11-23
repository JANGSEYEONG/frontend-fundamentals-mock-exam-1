import { ErrorBoundary, Suspense } from '@suspensive/react';
import { useState } from 'react';
import {
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { SavingProductItemList } from './components/SavingsProductItemList';
import { type SavingsProduct } from './api/getSavingsProducts';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [term, setTerm] = useState(12);

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
        value={targetAmount}
        onChange={e => setTargetAmount(e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount}
        onChange={e => setMonthlyAmount(e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={term} onChange={setTerm}>
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
                  {/* TODO: 납입액 입력 안했을 때 전체 데이터 보여주도록 조건 처리하기 */}
                  <SavingProductItemList
                    filterPredicates={[isMonthlyAmountInRange(Number(monthlyAmount)), isTermMatching(term)]}
                    selectedProduct={selectedProduct}
                    onClick={product => setSelectedProduct(product)}
                  />
                </Suspense>
              </ErrorBoundary>
            );
          case 'results':
            if (!selectedProduct) {
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
                      bottom={`1,000,000원`}
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
                      bottom={`-500,000원`}
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
                      bottom={`100,000원`}
                      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                    />
                  }
                />

                <Spacing size={8} />
                <Border height={16} />
                <Spacing size={8} />

                <ListHeader
                  title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                />
                <Spacing size={12} />

                <ListRow
                  contents={
                    <ListRow.Texts
                      type="3RowTypeA"
                      top={'기본 정기적금'}
                      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                      middle={`연 이자율: 3.2%`}
                      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                      bottom={`100,000원 ~ 500,000원 | 12개월`}
                      bottomProps={{ fontSize: 13, color: colors.grey600 }}
                    />
                  }
                  onClick={() => {}}
                />
                <ListRow
                  contents={
                    <ListRow.Texts
                      type="3RowTypeA"
                      top={'고급 정기적금'}
                      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                      middle={`연 이자율: 2.8%`}
                      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                      bottom={`50,000원 ~ 1,000,000원 | 24개월`}
                      bottomProps={{ fontSize: 13, color: colors.grey600 }}
                    />
                  }
                  onClick={() => {}}
                />

                <Spacing size={40} />
              </>
            );
        }
      })()}

      <Spacing size={8} />
    </>
  );
}

function isMonthlyAmountInRange(
  monthlyAmount: number
): (product: Pick<SavingsProduct, 'minMonthlyAmount' | 'maxMonthlyAmount'>) => boolean {
  return product => monthlyAmount >= product.minMonthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
}

function isTermMatching(term: number): (product: Pick<SavingsProduct, 'availableTerms'>) => boolean {
  return product => term === product.availableTerms;
}
