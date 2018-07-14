import Route from '@ember/routing/route';
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
