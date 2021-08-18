import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
export default Route.extend({
  store: service(),
  session: service(),
  setupController(controller) {
    controller.set('items', []);
    controller.set('total', 0);
  },
  actions: {
    itemChanged(itemName) {
      let controller = this.controller;
      let lineItems = controller.items;
      let existingLineItem = lineItems.findBy('SKU', itemName);
      if (existingLineItem) {
        set(existingLineItem, 'Initial Stock', Number(existingLineItem['Initial Stock']) + 1);
        controller.set('total', controller.total+1);
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
      controller.set('total', controller.total+1);
    },
    save() {
      let controller = this.controller;
      let body = {
        items: controller.items
      };
      controller.set('isSaving', true);
      controller.set('errorMessage', '');
      this.store.ajax('/adjustment', { method: 'POST', body }).then((json) => {
        if (json.message === 'success') {
          controller.set('items', []);
          controller.set('id', '');
        } else if (json.message === 'failure') {
          controller.set('errorMessage', json.error);
        }
      }).finally(() => {
        controller.set('isSaving', false);
      });
    },
    removeLineItem(lineItem) {
      let items = this.controller.items;
      items.removeObject(lineItem);
    },
  }
});
