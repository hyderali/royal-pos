import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next, schedule } from '@ember/runloop';

export default class AdjustItemController extends Controller {
  @service store;
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
  async print() {
    this.failedItems = [];
    const items = this.items;
    const printitems = this.printitems;
    const body = { items };

    items.forEach((item) => {
      for (let i = 0; i < Number(item.qty); i++) {
        printitems.pushObject(item);
      }
    });

    try {
      const json = await this.store.ajax('/itemsupdate', {
        method: 'POST',
        body
      });

      if (json.message === 'failure') {
        this.failedItems = json.failed_items;
        this.isShowingModal = true;
      }

      next(() => {
        schedule('afterRender', () => {
          window.print();
        });
      });
    } catch (error) {
      console.error('Error updating items:', error);
    }
  }

  @action
  addNewItem(itemName) {
    const itemslist = this.session.itemslist;
    const items = this.items;
    const newItem = itemslist.findBy('SKU', itemName);
    
    if (newItem) {
      items.pushObject(newItem);
    }
  }

  @action
  removeLineItem(lineItem) {
    this.items.removeObject(lineItem);
  }
}