type Curreny = 'KRW';

export const formatAmount = (
  value: number,
  options: {
    currency: Curreny;
  } = {
    currency: 'KRW',
  }
) => {
  switch (options.currency) {
    case 'KRW':
      return value.toLocaleString('ko-KR');

    default:
      options.currency satisfies never;
      throw new Error(`Unsupported currency: ${options.currency}`);
  }
};
