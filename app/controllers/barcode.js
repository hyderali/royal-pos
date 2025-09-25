import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';
import getItemName from '../utils/get-item-name';

export default class BarcodeController extends Controller {
  constructor() {
    super(...arguments);
    this.setProperties({
      items: [],
      printitems: [],
      failedItems: [],
    });
  }

  isShowingModal = false;

  @service
  store;

  @service
  session;

  id = '';

  @action
  toggleTranslucent() {
    this.toggleProperty('isShowingModal');
  }

  @action
  print() {
    let items = this.items;
    let printitems = [];
    items.forEach((item) => {
      for (let i = 0; i < Number(item.qty); i++) {
        printitems.pushObject(item);
      }
    });
    this.set('printitems', printitems);
    next(this, () => {
      schedule('afterRender', this, () => {
        window.print();
      });
    });
  }

  @action
  clear() {
    this.set('printitems', []);
    this.set('items', []);
  }

  @action
  addNewItem(itemName) {
    let itemslist = this.get('session.itemslist');
    let items = this.items;
    let newItem = itemslist.findBy('sku', getItemName(itemName));
    if (newItem) {
      newItem.printRate = Number(newItem.rate);
      items.pushObject(newItem);
    }
  }
}
