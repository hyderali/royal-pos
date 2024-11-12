import { action } from '@ember/object';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';

interface StickerItem {
  size?: string;
  weight?: string;
  pcs?: string;
  price?: string;
  qty?: number;
}

export default class PackstickerController extends Controller {
  items: StickerItem[] = [{}];
  printitems: StickerItem[] = [];

  constructor() {
    super(...arguments);
    this.setProperties({
      items: [{}],
      printitems: [],
    });
  }

  @action
  toggleTranslucent(): void {
    this.toggleProperty('isShowingModal');
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
    this.set('items', [{}]);
  }

  @action
  addItem(): void {
    this.items.pushObject({});
  }
}