import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';
import SessionService from '../services/session';

interface StickerItem {
  name?: string;
  price?: string | number;
  qty?: number;
}

export default class PlainstickerController extends Controller {
  @service declare session: SessionService;

  items: StickerItem[] = [];
  printitems: StickerItem[] = [];
  failedItems: any[] = [];

  constructor() {
    super(...arguments);
    this.setProperties({
      items: [{}],
      printitems: [],
      failedItems: [],
    });
  }

  @action
  print(): void {
    const items = this.items;
    const printitems: StickerItem[] = [];

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
  addNewItem(): void {
    const items = this.items;
    items.pushObject({});
  }
}