export const formatAmount = (
  value: number,
  options: {
    locales?: Intl.LocalesArgument;
  } = {
    locales: 'ko-KR',
  }
) => {
  return value.toLocaleString(options.locales);
};
