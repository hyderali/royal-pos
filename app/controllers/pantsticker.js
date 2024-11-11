import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next, schedule } from '@ember/runloop';

export default class PantStickerController extends Controller {
  @tracked items = [{}];
  @tracked printitems = [];

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
    this.items = [{}];
  }

  @action
  addItem() {
    this.items.pushObject({});
  }
}