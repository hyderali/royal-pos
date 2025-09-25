import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { set, action } from '@ember/object';
import getItemName from '../utils/get-item-name';
import todayDate from '../utils/today-date';

export default class AddstockRoute extends Route {
  @service
  store;

  @service
  session;

  setupController(controller) {
    controller.set('items', []);
    controller.set('total', 0);
  }

  @action
  itemChanged(itemName) {
    itemName = getItemName(itemName);
    let controller = this.controller;
    let lineItems = controller.items;
    let existingLineItem = lineItems.findBy('SKU', itemName);
    if (existingLineItem) {
      set(
        existingLineItem,
        'Initial Stock',
        Number(existingLineItem['Initial Stock']) + 1
      );
      controller.set('total', controller.total + 1);
      controller.set('id', '');
      return;
    }
    let itemslist = this.get('session.itemslist');
    let newItem = itemslist.findBy('sku', itemName);
    //Item Name,SKU,Description,Rate,Product Type,Status,Purchase Rate,Purchase Account,Inventory Account,Initial Stock,Initial Stock Rate,Item Type,Design,Size,Brand,Colour,Group,Discount
    if (newItem) {
      let newLineItem = {
        'Item Name': newItem['item_name'],
        SKU: newItem.sku,
        Description: newItem.description,
        Rate: newItem.rate,
        'Product Type': 'goods',
        Status: 'Active',
        'Purchase Rate': newItem['purchase_rate'],
        'Purchase Account': 'Cost of Goods Sold',
        'Inventory Account': 'Inventory Asset',
        'Initial Stock': 1,
        'Initial Stock Rate': newItem['purchase_rate'],
        'Item Type': 'Inventory',
        Design: newItem.CF.Design || '',
        Size: newItem.CF.Size || '',
        Brand: newItem.CF.Brand || '',
        Colour: newItem.CF.Colour || '',
        Group: newItem.CF.Group || '',
        Discount: newItem.CF.Discount || '',
      };
      lineItems.pushObject(newLineItem);
    }
    controller.set('id', '');
    controller.set('total', controller.total + 1);
  }

  @action
  save() {
    let controller = this.controller;
    let body = {
      items: controller.items,
      date: todayDate(),
    };
    controller.set('isSaving', true);
    controller.set('errorMessage', '');
    this.store
      .ajax('/adjustment', { method: 'POST', body })
      .then((json) => {
        if (json.message === 'success') {
          controller.set('items', []);
          controller.set('id', '');
          controller.set('total', 0);
        } else if (json.message === 'failure') {
          controller.set('errorMessage', json.error);
        }
      })
      .finally(() => {
        controller.set('isSaving', false);
      });
  }

  @action
  removeLineItem(lineItem) {
    let items = this.controller.items;
    items.removeObject(lineItem);
  }
}
