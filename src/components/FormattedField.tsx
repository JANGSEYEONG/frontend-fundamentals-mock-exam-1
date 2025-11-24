import { forwardRef, useState } from 'react';
import { TextField } from 'tosslib';

interface FormattedFieldProps extends Omit<React.ComponentProps<typeof TextField>, 'value' | 'onChange'> {
  formatter: (value: string) => string;
  onChange?: (value: string) => void;
}

export const FormattedField = forwardRef<HTMLInputElement, FormattedFieldProps>(
  ({ formatter, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState<string>('');

    return (
      <TextField
        ref={ref}
        value={displayValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const displayValue = formatter(e.target.value);

          setDisplayValue(displayValue);
          onChange?.(displayValue);
        }}
        {...props}
      />
    );
  }
);

FormattedField.displayName = 'FormattedField';
