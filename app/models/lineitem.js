import Object, { computed } from '@ember/object';

export default class Lineitem extends Object {
  @computed('quantity', 'rate')
  get total() {
    let quantity = Number(this.quantity);
    let rate = Number(this.rate);
    return rate * quantity;
  }

  @computed('total', 'discount')
  get discount_amount() {
    let total = Number(this.total);
    let discount = Number(this.discount);
    return Math.round(Number(total) * Number(discount / 100));
  }
}
