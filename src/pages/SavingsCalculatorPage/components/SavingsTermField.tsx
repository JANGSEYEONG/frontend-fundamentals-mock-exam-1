import { SelectBottomSheet } from 'tosslib';

interface SavingsTermFieldProps {
  label?: string;
  placeholder: string;
  value?: number;
  onChange: (value: number) => void;
}
export function SavingsTermField({ label, placeholder, value, onChange }: SavingsTermFieldProps) {
  return (
    <SelectBottomSheet<number> label={label} title={placeholder} value={value} onChange={onChange}>
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
}
