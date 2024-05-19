/* eslint camelcase: "off" */
import Object, { computed } from '@ember/object';

export default Object.extend({
  line_items: null,
  subtotal: computed('line_items.@each.total', function() {
    let lineItems = this.line_items;
    let subtotal = lineItems.reduce((sum, item)=> {
      return sum + Number(item.get('total'));
    }, 0);
    return subtotal;
  }),
  discount: computed('line_items.@each.{discount,total}', function() {
    let lineItems = this.line_items;
    let lineItemDiscount;
    let discount = lineItems.reduce((discount, item)=> {
      lineItemDiscount = item.discount_amount;
      return discount + lineItemDiscount;
    }, 0);
    return Math.round(discount);
  }),
  qtyTotal: computed('line_items.@each.quantity', function() {
    let lineItems = this.line_items;
    let qtyTotal = lineItems.reduce((sum, item)=> {
      return sum + Number(item.get('quantity'));
    }, 0);
    return qtyTotal;
  }),
  total: computed('subtotal', 'discount', function() {
    let subtotal = this.subtotal;
    let discount = this.discount;
    return subtotal - discount;
  }),
  date: computed(function() {
    let date =  new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }),
  time: computed(function() {
    let date =  new Date();
    let hours = date.getHours();
    let meridian = 'AM';
    if (hours > 12) {
      hours -= 12;
      meridian = 'PM';
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes} ${meridian}`;
  })
});
