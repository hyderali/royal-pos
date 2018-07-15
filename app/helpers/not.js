import { helper } from '@ember/component/helper';
export function not(params/* , hash*/) {
  return !params[0];
}

export default helper(not);
