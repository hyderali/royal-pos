import Ember from 'ember';
const {
  inject: {
    service
  }
} = Ember;
export default Ember.Controller.extend({
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
      let printitems = this.get('printitems');
      items.forEach(item => {
        for (let i = 0; i < Number(item.qty); i++) {
          printitems.pushObject(item);
        }
      });
      Ember.run.next(this, () => {
        Ember.run.schedule('afterRender', this, () => {
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
      let newItem = itemslist.findBy('SKU', itemName);
      if (newItem) {
        newItem.printRate = Number(newItem.Rate.split(' ')[1]);
        items.pushObject(newItem);
      }
    }
  }
});
