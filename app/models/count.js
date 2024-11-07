import Object, { computed } from '@ember/object';

export default class Count extends Object {
  @computed('items.@each.qty')
  get totalQty() {
    let lineItems = this.items;
    let total = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('qty'));
    }, 0);
    return total;
  }

  @computed('items.@each.cost_value')
  get totalCV() {
    let lineItems = this.items;
    let total = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('cost_value'));
    }, 0);
    return total;
  }

  @computed('items.@each.sales_value')
  get totalSV() {
    let lineItems = this.items;
    let total = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('sales_value'));
    }, 0);
    return total;
  }
}
