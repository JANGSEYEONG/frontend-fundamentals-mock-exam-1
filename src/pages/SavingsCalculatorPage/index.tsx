import { useState } from 'react';
import { Assets, Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { CalculationResult } from './components/CalculationResult';
import { ConditionForm } from './components/ConditionForm';
import { ProductList } from './components/ProductList';
import { CalculatorCondition, SavingsProduct } from './types';

export function SavingsCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState('products');

  const [calculatedCondition, setCalculatedCondition] = useState<CalculatorCondition>({
    targetAmount: undefined,
    monthlyAmount: undefined,
    term: undefined,
    savingsProduct: undefined,
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <ConditionForm
        onFieldChange={({ name, value }) => setCalculatedCondition(prev => ({ ...prev, [name]: value }))}
      />

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
              <ProductList
                select={savingsProducts =>
                  savingsProducts
                    .filter(getMonthlyAmountFilter(calculatedCondition.monthlyAmount))
                    .filter(getAvailableTermsFilter(calculatedCondition.term))
                }
                renderRight={savingsProdudct =>
                  savingsProdudct.id === calculatedCondition.savingsProduct?.id ? (
                    <Assets.Icon name="icon-check-circle-green" />
                  ) : null
                }
                onClick={product => setCalculatedCondition(prev => ({ ...prev, savingsProduct: product }))}
              />
            );
          case 'results':
            return (
              <CalculationResult
                condition={calculatedCondition}
                extra={
                  <>
                    <ListHeader
                      title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                    />
                    <Spacing size={12} />
                    <ProductList
                      select={savingsProducts =>
                        savingsProducts
                          .filter(getMonthlyAmountFilter(calculatedCondition.monthlyAmount))
                          .filter(getAvailableTermsFilter(calculatedCondition.term))
                          .sort((a, b) => b.annualRate - a.annualRate)
                          .slice(0, 2)
                      }
                      renderRight={savingsProdudct =>
                        savingsProdudct.id === calculatedCondition.savingsProduct?.id ? (
                          <Assets.Icon name="icon-check-circle-green" />
                        ) : null
                      }
                    />
                  </>
                }
              />
            );
        }
      })()}

      <Spacing size={8} />
    </>
  );
}

function getMonthlyAmountFilter(
  monthlyAmount?: number
): (product: Pick<SavingsProduct, 'minMonthlyAmount' | 'maxMonthlyAmount'>) => boolean {
  return product => {
    if (monthlyAmount === undefined) {
      return true;
    }
    return monthlyAmount >= product.minMonthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
  };
}

function getAvailableTermsFilter(term?: number): (product: Pick<SavingsProduct, 'availableTerms'>) => boolean {
  return product => {
    if (term === undefined) {
      return true;
    }
    return term === product.availableTerms;
  };
}
