import Object, { computed } from '@ember/object';
export default Object.extend({
  total: computed('quantity', 'rate', function() {
    let quantity = Number(this.quantity);
    let rate = Number(this.rate);
    return rate * quantity;
  })
});
