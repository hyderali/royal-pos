import { helper } from '@ember/component/helper';

export function difference([value1, value2, value3]: [number, number, number]): number {
  return (Number(value1) || 0) - (Number(value2) || 0) - (Number(value3) || 0);
}

export default helper(difference);