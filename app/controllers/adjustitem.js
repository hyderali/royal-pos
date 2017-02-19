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
      this.set('failedItems', []);
      let items = this.get('items');
      let printitems = this.get('printitems');
      let body = {};
      items.forEach(item => {
        for (let i = 0; i < Number(item.qty); i++) {
          printitems.pushObject(item);
        }
      });
      body.items = items;
      this.get('store').ajax('/itemsupdate', {
        method: 'POST',
        body
      }).then((json) => {
        if (json.message === 'failure') {
          this.set('failedItems', json.failed_items);
          this.set('isShowingModal', true);
        }
        Ember.run.next(this, () => {
          Ember.run.schedule('afterRender', this, () => {
            window.print();
          });
        });
      });
    },
    addNewItem(itemName) {
      let itemslist = this.get('session.itemslist');
      let items = this.get('items');
      let newItem = itemslist.findBy('SKU', itemName);
      if (newItem) {
        items.pushObject(newItem);
      }
    }
  }
});
