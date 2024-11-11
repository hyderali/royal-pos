import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class CountingController extends Controller {
  @computed('model.count.counts.@each.qty')
  get totalQty() {
    return this.model.count.counts.reduce((sum, item) => {
      return sum + Number(item.qty);
    }, 0);
  }

  @computed('model.count.counts.@each.cost_value')
  get totalCV() {
    return this.model.count.counts.reduce((sum, item) => {
      return sum + Number(item.cost_value);
    }, 0);
  }

  @computed('model.count.counts.@each.sales_value')
  get totalSV() {
    return this.model.count.counts.reduce((sum, item) => {
      return sum + Number(item.sales_value);
    }, 0);
  }
}