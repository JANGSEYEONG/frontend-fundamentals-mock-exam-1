import { isNotNil } from 'es-toolkit';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { Condition } from '../types';
import { formatAmount } from '../utils/formatAmount';

interface ConditionFormProps {
  value: Condition;
  onChange: (condition: Condition) => void;
}

export function ConditionForm({ value, onChange }: ConditionFormProps) {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={isNotNil(value.targetAmount) ? formatAmount(value.targetAmount) : ''}
        onChange={e => {
          if (e.target.value === '') {
            onChange({ ...value, targetAmount: undefined });
          } else {
            onChange({ ...value, targetAmount: Number(e.target.value.replace(/[^\d]/g, '')) });
          }
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={value.monthlyAmount ? formatAmount(value.monthlyAmount) : ''}
        onChange={e => {
          if (e.target.value === '') {
            onChange({ ...value, monthlyAmount: undefined });
          } else {
            onChange({ ...value, monthlyAmount: Number(e.target.value.replace(/[^\d]/g, '')) });
          }
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
