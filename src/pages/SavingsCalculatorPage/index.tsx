import { useState } from 'react';
import { Assets, Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { CalculationResult } from './components/CalculationResult';
import { ConditionForm } from './components/ConditionForm';
import { SavingsProductList } from './components/SavingsProductList';
import { Condition, SavingsProduct } from './types';

export function SavingsCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState('products');

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

      <ConditionForm
        value={condition}
        onChange={condition => {
          setCondition(condition);
        }}
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
              <CalculationResult
                condition={condition}
                extra={
                  <>
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
                  </>
                }
              />
            );
          default:
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
