import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

export interface ConditionFormData {
  targetAmount?: number;
  monthlyAmount?: number;
  term?: number;
}

interface ConditionFormProps {
  values: ConditionFormData;
  onValuesChange: (data: ConditionFormData) => void;
}

export function ConditionForm({ values, onValuesChange }: ConditionFormProps) {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={values.targetAmount?.toString()}
        onChange={e => onValuesChange({ ...values, targetAmount: Number(e.target.value) })}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={values.monthlyAmount?.toString()}
        onChange={e => onValuesChange({ ...values, monthlyAmount: Number(e.target.value) })}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={values.term}
        onChange={term => onValuesChange({ ...values, term })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
