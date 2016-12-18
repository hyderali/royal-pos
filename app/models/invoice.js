import Ember from 'ember';
const { computed } = Ember;
export default Ember.Object.extend({
  line_items: null,
  subtotal: computed('line_items.@each.total', function() {
    let lineItems = this.get('line_items');
    let subtotal = lineItems.reduce((sum, item)=> {
      return sum + Number(item.get('total'));
    }, 0);
    return subtotal;
  }),
  discount: computed('line_items.@each.{discount,total}', function() {
    let lineItems = this.get('line_items');
    let lineItemDiscount;
    let discount = lineItems.reduce((discount, item)=> {
      lineItemDiscount = Number(item.get('total')) * (Number(item.get('discount')/100));
      return discount + lineItemDiscount;
    }, 0);
    return Math.round(discount);
  }),
  discountPercent: computed('subtotal', 'discount', function() {
    let subtotal = this.get('subtotal');
    let discount = this.get('discount');
    return ((discount/subtotal)*100).toFixed(2);
  }),
  adjustment: computed('subtotal', 'discount', 'discountPercent', function() {
    let subtotal = this.get('subtotal');
    let discount = this.get('discount');
    let discountPercent = Number(this.get('discountPercent'));
    let adjustment = (Number(((subtotal * discountPercent)/100).toFixed(2)) - discount).toFixed(2);
    return adjustment;
  }),
  total: computed('subtotal', 'discount', function() {
    let subtotal = this.get('subtotal');
    let discount = this.get('discount');
    return subtotal - discount;
  })
});
