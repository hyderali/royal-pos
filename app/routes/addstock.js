import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import getItemName from '../utils/get-item-name';
import todayDate from '../utils/today-date';

export default class AddStockRoute extends Route {
  @service store;
  @service session;

  setupController(controller) {
    super.setupController(...arguments);
    controller.items = [];
    controller.total = 0;
  }

  @action
  itemChanged(itemName) {
    itemName = getItemName(itemName);
    const controller = this.controller;
    const lineItems = controller.items;
    const existingLineItem = lineItems.findBy('SKU', itemName);

    if (existingLineItem) {
      existingLineItem['Initial Stock'] = Number(existingLineItem['Initial Stock']) + 1;
      controller.total = controller.total + 1;
      controller.id = '';
      return;
    }

    const itemslist = this.session.itemslist;
    const newItem = itemslist.findBy('SKU', itemName);

    if (newItem) {
      const newLineItem = {
        'Item Name': newItem['Item Name'],
        'SKU': newItem.SKU,
        'Description': newItem.Description,
        'Rate': newItem.Rate,
        'Product Type': 'goods',
        'Status': 'Active',
        'Purchase Rate': newItem['Purchase Rate'],
        'Purchase Account': 'Cost of Goods Sold',
        'Inventory Account': 'Inventory Asset',
        'Initial Stock': 1,
        'Initial Stock Rate': newItem['Purchase Rate'],
        'Item Type': 'Inventory',
        'Design': newItem.CF.Design || '',
        'Size': newItem.CF.Size || '',
        'Brand': newItem.CF.Brand || '',
        'Colour': newItem.CF.Colour || '',
        'Group': newItem.CF.Group || '',
        'Discount': newItem.CF.Discount || ''
      };
      lineItems.pushObject(newLineItem);
    }

    controller.id = '';
    controller.total = controller.total + 1;
  }

  @action
  async save() {
    const controller = this.controller;
    const body = {
      items: controller.items,
      date: todayDate()
    };

    controller.isSaving = true;
    controller.errorMessage = '';

    try {
      const json = await this.store.ajax('/adjustment', { 
        method: 'POST', 
        body 
      });

      if (json.message === 'success') {
        controller.items = [];
        controller.id = '';
        controller.total = 0;
      } else if (json.message === 'failure') {
        controller.errorMessage = json.error;
      }
    } catch (error) {
      controller.errorMessage = error.message;
    } finally {
      controller.isSaving = false;
    }
  }

  @action
  removeLineItem(lineItem) {
    this.controller.items.removeObject(lineItem);
  }
}