import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';

export default class PlainstickerController extends Controller {
  constructor() {
    super(...arguments);
    this.setProperties({
      items: [{}],
      printitems: [],
      failedItems: [],
    });
  }

  @service
  session;

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
  addNewItem() {
    let items = this.items;
    items.pushObject({});
  }
}
