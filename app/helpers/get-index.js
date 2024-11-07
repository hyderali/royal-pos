import { helper } from '@ember/component/helper';
export function getIndex(params /* , hash*/) {
  return Number(params[0]) + 1;
}

export default helper(getIndex);
