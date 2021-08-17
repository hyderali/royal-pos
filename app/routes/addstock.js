import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
export default Route.extend({
  store: service(),
  session: service(),
  setupController(controller) {
    controller.set('items', []);
  },
  actions: {
    itemChanged(itemName) {
      let controller = this.controller;
      let lineItems = controller.items;
      let existingLineItem = lineItems.findBy('SKU', itemName);
      if (existingLineItem) {
        set(existingLineItem, 'Initial Stock', existingLineItem['Initial Stock'] + 1);
        controller.set('id', '');
        return;
      }
      let itemslist = this.get('session.itemslist');
      let newItem = itemslist.findBy('SKU', itemName);
      //Item Name,SKU,Description,Rate,Product Type,Status,Purchase Rate,Purchase Account,Inventory Account,Initial Stock,Initial Stock Rate,Item Type,CF.Design,CF.Size,CF.Item Number,CF.Brand,CF.Colour,CF.Group,CF.Discount
      if (newItem) {
        let newLineItem = {
          'Item Name': newItem['Item Name'],
          'SKU':newItem.SKU,
          'Description':newItem.Description,
          'Rate':newItem.Rate,
          'Product Type':'goods',
          'Status':'Active',
          'Purchase Rate':newItem['Purchase Rate'],
          'Purchase Account':'Cost of Goods Sold',
          'Inventory Account':'Inventory Asset',
          'Initial Stock':1,
          'Initial Stock Rate':newItem['Purchase Rate'],
          'Item Type':'Inventory',
          'Design':newItem.CF.Design || '',
          'Size':newItem.CF.Size || '',
          'Brand':newItem.CF.Brand || '',
          'Colour':newItem.CF.Colour || '',
          'Group':newItem.CF.Group || '',
          'Discount':newItem.CF.Discount || ''
        };
        lineItems.pushObject(newLineItem);
      }
      controller.set('id', '');
    },
    save() {
      let controller = this.controller;
      let body = {
        items: controller.items
      };
      this.set('isSaving', true);
      this.store.ajax('/adjustment', { method: 'POST', body }).then(() => {
        controller.set('items', []);
        controller.set('id', '');
      }).catch(error => {
        this.set('controller.errorMessage', error);
      }).finally(() => {
        this.set('isSaving', false);
      });
    },
    removeLineItem(lineItem) {
      let items = this.controller.items;
      items.removeObject(lineItem);
    },
  }
});
