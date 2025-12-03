import { isNotNil } from 'es-toolkit';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { Condition } from '../types';
import { formatAmount } from '../utils/formatAmount';
import { ComponentProps } from 'react';

interface ConditionFormProps {
  value: Condition;
  onChange: (condition: Condition) => void;
}

export function ConditionForm({ value, onChange }: ConditionFormProps) {
  return (
    <>
      <AmountField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={value.targetAmount}
        onChange={amount => {
          onChange({ ...value, targetAmount: amount });
        }}
      />
      <Spacing size={16} />
      <AmountField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={value.monthlyAmount}
        onChange={amount => {
          onChange({ ...value, monthlyAmount: amount });
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet<number>
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={value.term}
        onChange={term => onChange({ ...value, term })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}

interface AmountFieldProps extends Omit<ComponentProps<typeof TextField>, 'value' | 'onChange'> {
  value?: number;
  onChange?: (amount?: number) => void;
}

function AmountField({ value, onChange, ...props }: AmountFieldProps) {
  return (
    <TextField
      value={isNotNil(value) ? formatAmount(value) : ''}
      onChange={e => {
        if (e.target.value === '') {
          onChange?.(undefined);
          return;
        } else {
          onChange?.(Number(e.target.value.replace(/[^\d]/g, '')));
        }
      }}
      {...props}
    />
  );
}
