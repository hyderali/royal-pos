import { helper } from '@ember/component/helper';

export function getIndex([index]: [number]): number {
  return Number(index) + 1;
}

export default helper(getIndex);