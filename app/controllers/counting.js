import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default class CountingController extends Controller {
  @computed('model.count.counts', 'model.count.counts@each.qty')
  get totalQty() {
    let lineItems = this.model.count.counts;
    let total = lineItems.reduce((sum, item) => {
      return sum + Number(item.qty);
    }, 0);
    return total;
  }

  @computed('model.count.counts', 'model.count.counts@each.cost_value')
  get totalCV() {
    let lineItems = this.model.count.counts;
    let total = lineItems.reduce((sum, item) => {
      return sum + Number(item.cost_value);
    }, 0);
    return total;
  }

  @computed('model.count.counts', 'model.count.counts@each.sales_value')
  get totalSV() {
    let lineItems = this.model.count.counts;
    let total = lineItems.reduce((sum, item) => {
      return sum + Number(item.sales_value);
    }, 0);
    return total;
  }
}
