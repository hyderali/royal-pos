import { helper } from '@ember/component/helper';

export function product([value1, value2]: [number, number]): number {
  return (Number(value1) || 0) * (Number(value2) || 0);
}

export default helper(product);