import { helper } from '@ember/component/helper';

export default helper(function formatCurrency(params/*, hash*/) {
  return new Intl.NumberFormat('en-IN').format(params[0]);
});
