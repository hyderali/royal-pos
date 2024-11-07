import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';
import getItemName from '../utils/get-item-name';

export default class AdjustitemController extends Controller {
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

  @action
  toggleTranslucent() {
    this.toggleProperty('isShowingModal');
  }

  @action
  print() {
    this.set('failedItems', []);
    let items = this.items;
    let printitems = this.printitems;
    let body = {};
    items.forEach((item) => {
      for (let i = 0; i < Number(item.qty); i++) {
        printitems.pushObject(item);
      }
    });
    body.items = items;
    this.store
      .ajax('/itemsupdate', {
        method: 'POST',
        body,
      })
      .then((json) => {
        if (json.message === 'failure') {
          this.set('failedItems', json.failed_items);
          this.set('isShowingModal', true);
        }
        next(this, () => {
          schedule('afterRender', this, () => {
            window.print();
          });
        });
      });
  }

  @action
  addNewItem(itemName) {
    itemName = getItemName(itemName);
    let itemslist = this.get('session.itemslist');
    let items = this.items;
    let newItem = itemslist.findBy('SKU', itemName);
    if (newItem) {
      items.pushObject(newItem);
    }
  }

  @action
  removeLineItem(lineItem) {
    let lineItems = this.items;
    lineItems.removeObject(lineItem);
  }
}
