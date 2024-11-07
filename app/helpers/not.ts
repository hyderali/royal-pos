import { helper } from '@ember/component/helper';

export function not([value]: [any]): boolean {
  return !value;
}

export default helper(not);