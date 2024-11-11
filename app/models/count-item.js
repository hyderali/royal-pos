import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class CountItem extends EmberObject {
  @tracked qty = 0;
  @tracked sku = '';
  @tracked cost_price = 0;
  @tracked sales_price = 0;
  @tracked description = '';

  @computed('qty', 'cost_price')
  get cost_value() {
    return Number(this.qty) * Number(this.cost_price);
  }

  @computed('qty', 'sales_price')
  get sales_value() {
    return Number(this.qty) * Number(this.sales_price);
  }
}