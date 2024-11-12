import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';
import getItemName from '../utils/get-item-name';
import SessionService from '../services/session';
import StoreService from '../services/store';

interface Item {
  SKU: string;
  qty?: number;
  Rate?: string;
  Description?: string;
  printRate?: number;
}

interface FailedItem {
  error: {
    sku: string;
    message: string;
  };
}

export default class BarcodeController extends Controller {
  @service declare session: SessionService;
  @service declare store: StoreService;

  items: Item[] = [];
  printitems: Item[] = [];
  failedItems: FailedItem[] = [];
  isShowingModal = false;
  id = '';

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
    const items = this.items;
    const printitems: Item[] = [];

    items.forEach(item => {
      for (let i = 0; i < Number(item.qty); i++) {
        printitems.push(item);
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
  clear(): void {
    this.set('printitems', []);
    this.set('items', []);
  }

  @action
  addNewItem(itemName: string): void {
    const itemslist = this.session.itemslist;
    const items = this.items;
    const newItem = itemslist?.find(item => item.SKU === getItemName(itemName));

    if (newItem) {
      newItem.printRate = Number(newItem.Rate.split(' ')[1]);
      items.pushObject(newItem);
    }
  }
}