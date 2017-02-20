import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return [
      {SKU: 'print'},
      {SKU: 'print'},
      {SKU: 'print'}
    ];
  },
  actions: {
    print() {
      window.print();
    }
  }
});
