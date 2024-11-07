import { action } from '@ember/object';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';

export default class PackstickerController extends Controller {
  constructor() {
    super(...arguments);
    this.setProperties({
      items: [{}],
      printitems: [],
    });
  }

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
    this.set('items', [{}]);
  }

  @action
  addItem() {
    this.items.pushObject({});
  }
}
