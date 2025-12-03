import { isNotNil } from 'es-toolkit';
import { ComponentProps } from 'react';
import { TextField } from 'tosslib';
import { formatAmount } from '../utils/formatAmount';

interface AmountFieldProps extends Omit<ComponentProps<typeof TextField>, 'value' | 'onChange'> {
  value?: number;
  onChange?: (value?: number) => void;
}

export function AmountField({ value, onChange, ...props }: AmountFieldProps) {
  return (
    <TextField
      value={isNotNil(value) ? formatAmount(value) : ''}
      onChange={e => {
        if (e.target.value === '') {
          onChange?.();
          return;
        } else {
          onChange?.(Number(e.target.value.replace(/[^\d]/g, '')));
        }
      }}
      {...props}
    />
  );
}
