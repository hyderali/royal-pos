import { action } from '@ember/object';
import Controller from '@ember/controller';

export default class AddstockController extends Controller {
  @action
  computeTotal() {
    let items = this.items;
    let total = 0;
    items.forEach((item) => {
      total += Number(item['Initial Stock']);
    });
    this.set('total', total);
  }

  @action
  itemChangedC(itemName) {
    this.send('itemChanged', itemName);
  }

  @action
  removeLineItemC(lineItem) {
    this.send('removeLineItem', lineItem);
    this.send('computeTotal');
  }

  @action
  saveC(itemName) {
    this.send('save');
  }
}
