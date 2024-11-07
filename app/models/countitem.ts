import EmberObject, { computed } from '@ember/object';

export default class CountItem extends EmberObject {
  declare qty: number;
  declare sku: string;
  declare cost_price: number;
  declare sales_price: number;
  declare description: string;

  @computed('qty', 'cost_price')
  get cost_value(): number {
    return Number(this.qty) * Number(this.cost_price);
  }

  @computed('qty', 'sales_price')
  get sales_value(): number {
    return Number(this.qty) * Number(this.sales_price);
  }
}