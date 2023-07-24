import { helper } from '@ember/component/helper';

export default helper(function percent(params/*, hash*/) {
  return Math.round((Number(params[0]) || 0) *  (Number(params[1]) || 0)/100);
});
