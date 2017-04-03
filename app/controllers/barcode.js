import Ember from 'ember';
import getItemName from '../utils/get-item-name';
const {
  inject: {
    service
  },
  Controller,
  run: { schedule, next }
} = Ember;
export default Controller.extend({
  items: [],
  printitems: [],
  failedItems: [],
  isShowingModal: false,
  store: service(),
  session: service(),
  actions: {
    toggleTranslucent() {
      this.toggleProperty('isShowingModal');
    },
    print() {
      let items = this.get('items');
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
    addNewItem(itemName) {
      let itemslist = this.get('session.itemslist');
      let items = this.get('items');
      let newItem = itemslist.findBy('SKU', getItemName(itemName));
      if (newItem) {
        newItem.printRate = Number(newItem.Rate.split(' ')[1]);
        items.pushObject(newItem);
      }
    }
  }
});
