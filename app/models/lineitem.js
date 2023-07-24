import Object, { computed } from '@ember/object';
export default Object.extend({
  total: computed('quantity', 'rate', function() {
    let quantity = Number(this.quantity);
    let rate = Number(this.rate);
    return quantity * rate;
  }),
  discountedRate: computed('rate', 'discount', function() {
    let discount = Number(this.discount);
    let rate = Number(this.rate);
    return Number(rate - ((rate * discount)/100));
  }),
  discountAmount: computed('rate', 'discount', 'quantity', function() {
    let discount = Number(this.discount);
    let rate = Number(this.rate);
    let quantity = Number(this.quantity);
    return Number(quantity * ((rate * discount)/100));
  }),
  discountedTotal: computed('quantity', 'rate', function() {
    let quantity = Number(this.quantity);
    let discountedRate = Number(this.discountedRate);
    return quantity * discountedRate;
  }),
});
