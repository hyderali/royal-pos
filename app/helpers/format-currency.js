import { helper } from '@ember/helper';

function formatCurrency([value]) {
  return new Intl.NumberFormat('en-IN').format(value);
}

export default helper(formatCurrency);