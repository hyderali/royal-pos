import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';
export default Controller.extend({
  items: [{}],
  printitems: [],
  session: service(),
  actions: {
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
    },
    clear() {
      this.set('printitems', []);
      this.set('items', []);
    },
    addNewItem() {
      let items = this.items;
      items.pushObject({});
    }
  }
});
