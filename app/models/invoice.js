/* eslint camelcase: "off" */
import Object, { computed } from '@ember/object';

export default class Invoice extends Object {
  line_items = null;

  @computed('line_items.@each.total')
  get subtotal() {
    let lineItems = this.line_items;
    let subtotal = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('total'));
    }, 0);
    return subtotal;
  }

  @computed('line_items.@each.{discount,total}')
  get discount() {
    let lineItems = this.line_items;
    let lineItemDiscount;
    let discount = lineItems.reduce((discount, item) => {
      lineItemDiscount = item.discount_amount;
      return discount + lineItemDiscount;
    }, 0);
    return Math.round(discount);
  }

  @computed('line_items.@each.quantity')
  get qtyTotal() {
    let lineItems = this.line_items;
    let qtyTotal = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('quantity'));
    }, 0);
    return qtyTotal;
  }

  @computed('subtotal', 'discount')
  get total() {
    let subtotal = this.subtotal;
    let discount = this.discount;
    return subtotal - discount;
  }

  @computed
  get date() {
    let date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  @computed
  get time() {
    let date = new Date();
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
  }
}
