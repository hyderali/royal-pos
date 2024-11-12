import { helper } from '@ember/component/helper';

function formatCurrency([value]) {
  return new Intl.NumberFormat('en-IN').format(value);
}

export default helper(formatCurrency);