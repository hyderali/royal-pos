import Controller from '@ember/controller';
import { next, schedule } from '@ember/runloop';
export default Controller.extend({
  items: [{}],
  printitems: [],
  actions: {
    toggleTranslucent() {
      this.toggleProperty('isShowingModal');
    },
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
      this.set('items', [{}]);
    },
    addItem() {
      this.get('items').pushObject({});
    }
  }
});
