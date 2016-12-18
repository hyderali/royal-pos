import Ember from 'ember';

export function getIndex(params/*, hash*/) {
  return Number(params[0])+1;
}

export default Ember.Helper.helper(getIndex);
