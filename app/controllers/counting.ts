import { computed } from '@ember/object';
import Controller from '@ember/controller';

interface CountItem {
  qty: number;
  cost_value: number;
  sales_value: number;
}

interface CountModel {
  count: {
    counts: CountItem[];
  };
}

export default class CountingController extends Controller {
  declare model: CountModel;

  @computed('model.count.counts', 'model.count.counts@each.qty')
  get totalQty(): number {
    const lineItems = this.model.count.counts;
    const total = lineItems.reduce((sum, item) => {
      return sum + Number(item.qty);
    }, 0);
    return total;
  }

  @computed('model.count.counts', 'model.count.counts@each.cost_value')
  get totalCV(): number {
    const lineItems = this.model.count.counts;
    const total = lineItems.reduce((sum, item) => {
      return sum + Number(item.cost_value);
    }, 0);
    return total;
  }

  @computed('model.count.counts', 'model.count.counts@each.sales_value')
  get totalSV(): number {
    const lineItems = this.model.count.counts;
    const total = lineItems.reduce((sum, item) => {
      return sum + Number(item.sales_value);
    }, 0);
    return total;
  }
}