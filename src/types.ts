export interface FilterCondition<T> {
  field: keyof T;
  operator: 'eq' | 'lte' | 'gte';
  /** 비교 대상 값 */
  value: unknown;
}

export interface OrderByCondition<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}
