import { useState } from 'react';
import { Assets, Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { AmountField } from './components/AmountField';
import { CalculationResult } from './components/CalculationResult';
import { SavingsProductList } from './components/SavingsProductList';
import { SavingsTermField } from './components/SavingsTermField';
import { Condition, SavingsProduct } from './types';

type SavingsView = 'products' | 'results';

export function SavingsCalculatorPage() {
  const [view, setView] = useState<SavingsView>('products');

  const [condition, setCondition] = useState<Condition>({
    targetAmount: undefined,
    monthlyAmount: undefined,
    term: 12,
    savingsProduct: undefined,
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <AmountField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={condition.targetAmount}
        onChange={targetAmount => {
          setCondition(prev => ({ ...prev, targetAmount }));
        }}
      />
      <Spacing size={16} />
      <AmountField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={condition.monthlyAmount}
        onChange={monthlyAmount => {
          setCondition(prev => ({ ...prev, monthlyAmount }));
        }}
      />
      <Spacing size={16} />
      <SavingsTermField
        label="저축 기간"
        placeholder="저축 기간을 선택해주세요"
        value={condition.term}
        onChange={term => {
          setCondition(prev => ({ ...prev, term }));
        }}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setView(value as SavingsView)}>
        <Tab.Item value="products" selected={view === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={view === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {(() => {
        switch (view) {
          case 'products':
            return (
              <SavingsProductList
                select={savingsProducts =>
                  savingsProducts
                    .filter(getMonthlyAmountFilter(condition.monthlyAmount))
                    .filter(getAvailableTermsFilter(condition.term))
                }
                renderRight={savingsProdudct =>
                  savingsProdudct.id === condition.savingsProduct?.id ? (
                    <Assets.Icon name="icon-check-circle-green" />
                  ) : null
                }
                onClick={product => setCondition(prev => ({ ...prev, savingsProduct: product }))}
              />
            );
          case 'results':
            return (
              <>
                <CalculationResult condition={condition} />

                <Spacing size={8} />
                <Border height={16} />
                <Spacing size={8} />

                <ListHeader
                  title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                />
                <Spacing size={12} />
                <SavingsProductList
                  select={savingsProducts =>
                    savingsProducts
                      .filter(getMonthlyAmountFilter(condition.monthlyAmount))
                      .filter(getAvailableTermsFilter(condition.term))
                      .sort((a, b) => b.annualRate - a.annualRate)
                      .slice(0, 2)
                  }
                  renderRight={savingsProdudct =>
                    savingsProdudct.id === condition.savingsProduct?.id ? (
                      <Assets.Icon name="icon-check-circle-green" />
                    ) : null
                  }
                />

                <Spacing size={40} />
              </>
            );
          default:
            view satisfies never;
            throw new Error('The tab does not exist');
        }
      })()}

      <Spacing size={8} />
    </>
  );
}

function getMonthlyAmountFilter(monthlyAmount?: number): (savingsProduct: SavingsProduct) => boolean {
  return savingsProduct => {
    if (monthlyAmount === undefined) {
      return true;
    }
    return monthlyAmount >= savingsProduct.minMonthlyAmount && monthlyAmount <= savingsProduct.maxMonthlyAmount;
  };
}

function getAvailableTermsFilter(term?: number): (savingsProduct: SavingsProduct) => boolean {
  return savingsProduct => {
    if (term === undefined) {
      return true;
    }
    return term === savingsProduct.availableTerms;
  };
}
