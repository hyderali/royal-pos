import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { set, action } from '@ember/object';
import getItemName from '../utils/get-item-name';
import todayDate from '../utils/today-date';
import SessionService from '../services/session';
import StoreService from '../services/store';

interface StockItem {
  SKU: string;
  'Item Name': string;
  Description: string;
  Rate: string;
  'Product Type': string;
  Status: string;
  'Purchase Rate': string;
  'Purchase Account': string;
  'Inventory Account': string;
  'Initial Stock': number;
  'Initial Stock Rate': string;
  'Item Type': string;
  Design?: string;
  Size?: string;
  Brand?: string;
  Colour?: string;
  Group?: string;
  Discount?: string;
}

export default class AddstockRoute extends Route {
  @service declare store: StoreService;
  @service declare session: SessionService;

  setupController(controller: any): void {
    controller.setProperties({
      items: [],
      total: 0
    });
  }

  @action
  itemChanged(itemName: string): void {
    itemName = getItemName(itemName);
    const controller = this.controller;
    const lineItems = controller.items;
    const existingLineItem = lineItems.find((item: StockItem) => item.SKU === itemName);

    if (existingLineItem) {
      set(existingLineItem, 'Initial Stock', Number(existingLineItem['Initial Stock']) + 1);
      controller.set('total', controller.total + 1);
      controller.set('id', '');
      return;
    }

    const itemslist = this.session.itemslist;
    const newItem = itemslist?.find((item: any) => item.SKU === itemName);

    if (newItem) {
      const newLineItem: StockItem = {
        'Item Name': newItem['Item Name'],
        SKU: newItem.SKU,
        Description: newItem.Description,
        Rate: newItem.Rate,
        'Product Type': 'goods',
        Status: 'Active',
        'Purchase Rate': newItem['Purchase Rate'],
        'Purchase Account': 'Cost of Goods Sold',
        'Inventory Account': 'Inventory Asset',
        'Initial Stock': 1,
        'Initial Stock Rate': newItem['Purchase Rate'],
        'Item Type': 'Inventory',
        Design: newItem.CF?.Design || '',
        Size: newItem.CF?.Size || '',
        Brand: newItem.CF?.Brand || '',
        Colour: newItem.CF?.Colour || '',
        Group: newItem.CF?.Group || '',
        Discount: newItem.CF?.Discount || '',
      };
      lineItems.pushObject(newLineItem);
    }

    controller.set('id', '');
    controller.set('total', controller.total + 1);
  }

  @action
  async save(): Promise<void> {
    const controller = this.controller;
    const body = {
      items: controller.items,
      date: todayDate(),
    };

    controller.setProperties({
      isSaving: true,
      errorMessage: ''
    });

    try {
      const json = await this.store.ajax('/adjustment', { method: 'POST', body });
      
      if (json.message === 'success') {
        controller.setProperties({
          items: [],
          id: '',
          total: 0
        });
      } else if (json.message === 'failure') {
        controller.set('errorMessage', json.error);
      }
    } finally {
      controller.set('isSaving', false);
    }
  }

  @action
  removeLineItem(lineItem: StockItem): void {
    const items = this.controller.items;
    items.removeObject(lineItem);
  }
}