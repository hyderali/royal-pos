import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';
import getItemName from '../utils/get-item-name';
import SessionService from '../services/session';
import StoreService from '../services/store';

interface Item {
  SKU: string;
  Description: string;
  Rate: string;
  printRate?: number;
  qty?: number;
}

interface FailedItem {
  error: {
    sku: string;
    message: string;
  };
}

export default class AdjustitemController extends Controller {
  @service declare session: SessionService;
  @service declare store: StoreService;

  items: Item[] = [];
  printitems: Item[] = [];
  failedItems: FailedItem[] = [];
  isShowingModal = false;

  constructor() {
    super(...arguments);
    this.setProperties({
      items: [],
      printitems: [],
      failedItems: [],
    });
  }

  @action
  toggleTranslucent(): void {
    this.toggleProperty('isShowingModal');
  }

  @action
  print(): void {
    this.set('failedItems', []);
    const items = this.items;
    const printitems = this.printitems;
    const body = { items };

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
  addNewItem(itemName: string): void {
    itemName = getItemName(itemName);
    const itemslist = this.session.itemslist;
    const items = this.items;
    const newItem = itemslist?.find(item => item.SKU === itemName);
    
    if (newItem) {
      items.pushObject(newItem);
    }
  }

  @action
  removeLineItem(lineItem: Item): void {
    const lineItems = this.items;
    lineItems.removeObject(lineItem);
  }
}