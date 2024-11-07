import EmberObject, { computed } from '@ember/object';
import CountItem from './countitem';

export default class Count extends EmberObject {
  declare items: CountItem[];
  declare count_id: string;
  declare isNew: boolean;

  @computed('items.@each.qty')
  get totalQty(): number {
    const lineItems = this.items;
    const total = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('qty'));
    }, 0);
    return total;
  }

  @computed('items.@each.cost_value')
  get totalCV(): number {
    const lineItems = this.items;
    const total = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('cost_value'));
    }, 0);
    return total;
  }

  @computed('items.@each.sales_value')
  get totalSV(): number {
    const lineItems = this.items;
    const total = lineItems.reduce((sum, item) => {
      return sum + Number(item.get('sales_value'));
    }, 0);
    return total;
  }
}