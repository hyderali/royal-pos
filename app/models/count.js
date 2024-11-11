import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class Count extends EmberObject {
  @tracked items = [];
  @tracked count_id = '';
  @tracked isNew = true;

  @computed('items.@each.qty')
  get totalQty() {
    return this.items.reduce((sum, item) => {
      return sum + Number(item.qty);
    }, 0);
  }

  @computed('items.@each.cost_value')
  get totalCV() {
    return this.items.reduce((sum, item) => {
      return sum + Number(item.cost_value);
    }, 0);
  }

  @computed('items.@each.sales_value')
  get totalSV() {
    return this.items.reduce((sum, item) => {
      return sum + Number(item.sales_value);
    }, 0);
  }
}