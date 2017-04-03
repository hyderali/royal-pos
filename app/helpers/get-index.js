import Ember from 'ember';
const { Helper: { helper } } = Ember;
export function getIndex(params/* , hash*/) {
  return Number(params[0]) + 1;
}

export default helper(getIndex);
