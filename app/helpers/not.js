import Ember from 'ember';
const { Helper: { helper } } = Ember;
export function not(params/* , hash*/) {
  return !params[0];
}

export default helper(not);
