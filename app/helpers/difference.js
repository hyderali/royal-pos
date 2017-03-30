import Ember from 'ember';

export function difference(params) {
  return (Number(params[0]) || 0) -  (Number(params[1]) || 0) -  (Number(params[2]) || 0);
}

export default Ember.Helper.helper(difference);
