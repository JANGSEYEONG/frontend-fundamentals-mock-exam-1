import { Controller, useForm } from 'react-hook-form';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

interface ConditionFormData {
  targetAmount?: number;
  monthlyAmount?: number;
  term?: number;
}

interface ConditionFormProps {
  onValuesChange: (data: ConditionFormData) => void;
}

export function ConditionForm({ onValuesChange }: ConditionFormProps) {
  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      targetAmount: undefined,
      monthlyAmount: undefined,
      term: 12,
    },
  });

  form.watch(values => {
    onValuesChange(values);
  });

  return (
    <form>
      <Controller
        name="targetAmount"
        control={form.control}
        render={({ field }) => (
          <TextField
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            suffix="원"
            value={formatNumber(field.value)}
            onChange={e => {
              field.onChange(formatNumber(e.target.value));
            }}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="monthlyAmount"
        control={form.control}
        render={({ field }) => (
          <TextField
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={formatNumber(field.value)}
            onChange={e => {
              field.onChange(formatNumber(e.target.value));
            }}
          />
        )}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={form.getValues('term')}
        onChange={term => form.setValue('term', term)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </form>
  );
}
