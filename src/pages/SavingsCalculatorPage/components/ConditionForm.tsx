import { useState } from 'react';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

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
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        onChange={e =>
          onFieldChange({
            name: 'targetAmount',
            value: Number(e.target.value),
          })
        }
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        onChange={e =>
          onFieldChange({
            name: 'monthlyAmount',
            value: Number(e.target.value),
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
