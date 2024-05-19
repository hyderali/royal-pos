import Object, { computed } from '@ember/object';
export default Object.extend({
  total: computed('quantity', 'rate', function() {
    let quantity = Number(this.quantity);
    let rate = Number(this.rate);
    return rate * quantity;
  }),
  discount_amount: computed('total', 'discount', function() {
    let total = Number(this.total);
    let discount = Number(this.discount);
    return Math.round(Number(total) * (Number(discount / 100)));
  }),
});
