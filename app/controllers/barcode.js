import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next, schedule } from '@ember/runloop';
import getItemName from '../utils/get-item-name';

export default class BarcodeController extends Controller {
  @service session;
  @tracked items = [];
  @tracked printitems = [];
  @tracked failedItems = [];
  @tracked isShowingModal = false;

  @action
  toggleTranslucent() {
    this.isShowingModal = !this.isShowingModal;
  }

  @action
  print() {
    const items = this.items;
    const printitems = [];
    
    items.forEach((item) => {
      for (let i = 0; i < Number(item.qty); i++) {
        printitems.pushObject(item);
      }
    });

    this.printitems = printitems;

    next(() => {
      schedule('afterRender', () => {
        window.print();
      });
    });
  }

  @action
  clear() {
    this.printitems = [];
    this.items = [];
  }

  @action
  addNewItem(itemName) {
    const itemslist = this.session.itemslist;
    const items = this.items;
    const newItem = itemslist.findBy('SKU', getItemName(itemName));
    
    if (newItem) {
      newItem.printRate = Number(newItem.Rate.split(' ')[1]);
      items.pushObject(newItem);
    }
  }
}