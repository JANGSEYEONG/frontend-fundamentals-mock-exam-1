export const formatAmount = (
  value?: number,
  options: {
    locales?: Intl.LocalesArgument;
  } = {
    locales: 'ko-KR',
  }
) => {
  if (value === undefined || isNaN(value)) {
    return undefined;
  }
  return value.toLocaleString(options.locales);
};
