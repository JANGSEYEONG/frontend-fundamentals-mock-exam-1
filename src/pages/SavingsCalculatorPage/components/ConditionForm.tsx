import { forwardRef, useState } from 'react';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { formatAmount } from '../utils/formatAmount';

interface ConditionFormData {
  targetAmount?: number;
  monthlyAmount?: number;
  term?: number;
}

interface FieldChangeEvent<T extends keyof ConditionFormData> {
  name: T;
  value: ConditionFormData[T];
}

interface ConditionFormProps<T extends keyof ConditionFormData> {
  onFieldChange: (event: FieldChangeEvent<T>) => void;
}

export function ConditionForm({ onFieldChange }: ConditionFormProps<keyof ConditionFormData>) {
  const [terms, setTerms] = useState<number | undefined>();

  return (
    <>
      <AmountField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        onChange={amount =>
          onFieldChange({
            name: 'targetAmount',
            value: amount,
          })
        }
      />
      <Spacing size={16} />
      <AmountField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        onChange={amount =>
          onFieldChange({
            name: 'monthlyAmount',
            value: amount,
          })
        }
      />
      <Spacing size={16} />
      <SelectBottomSheet<number>
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={terms}
        onChange={term => {
          setTerms(term);
          onFieldChange({
            name: 'term',
            value: term,
          });
        }}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}

interface AmountFieldProps extends Omit<React.ComponentProps<typeof TextField>, 'value' | 'onChange'> {
  onChange?: (amount: number | undefined) => void;
}

const AmountField = forwardRef<HTMLInputElement, AmountFieldProps>(({ onChange, ...props }, ref) => {
  const [displayAmount, setDisplayAmount] = useState<string>('');

  return (
    <TextField
      ref={ref}
      value={displayAmount}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        const displayValue = inputValue.replace(/[^\d]/g, '').replace(/^0+/, '');

        if (displayValue === '') {
          setDisplayAmount('');
          onChange?.(undefined);
          return;
        } else {
          const numericValue = Number(displayValue);
          setDisplayAmount(formatAmount(numericValue));
          onChange?.(numericValue);
        }
      }}
      {...props}
    />
  );
});

AmountField.displayName = 'NumberField';
