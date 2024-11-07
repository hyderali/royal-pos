import Object, { computed } from '@ember/object';

export default class Countitem extends Object {
  @computed('qty', 'cost_price')
  get cost_value() {
    return Number(this.qty) * Number(this.cost_price);
  }

  @computed('qty', 'sales_price')
  get sales_value() {
    return Number(this.qty) * Number(this.sales_price);
  }
}
