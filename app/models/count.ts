import EmberObject, { computed } from '@ember/object';
import CountItem from './countitem';

export default class Count extends EmberObject {
  declare items: CountItem[];
  declare count_id: string;
  declare isNew: boolean;

  @computed('items.@each.qty')
  get totalQty(): number {
    return this.items.reduce((sum, item) => sum + Number(item.qty), 0);
  }

  @computed('items.@each.cost_value')
  get totalCV(): number {
    return this.items.reduce((sum, item) => sum + Number(item.cost_value), 0);
  }

  @computed('items.@each.sales_value')
  get totalSV(): number {
    return this.items.reduce((sum, item) => sum + Number(item.sales_value), 0);
  }
}