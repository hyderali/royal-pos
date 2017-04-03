import Ember from 'ember';
const { Route } = Ember;
export default Route.extend({
  model() {
    return [
      { SKU: 'print' },
      { SKU: 'print' },
      { SKU: 'print' }
    ];
  },
  actions: {
    print() {
      window.print();
    }
  }
});
