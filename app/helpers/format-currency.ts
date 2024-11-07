import { helper } from '@ember/component/helper';

export function formatCurrency([value]: [number]): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export default helper(formatCurrency);