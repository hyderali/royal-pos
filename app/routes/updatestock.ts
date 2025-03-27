import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { isPresent } from '@ember/utils';
import getItemName from '../utils/get-item-name';
import SessionService from '../services/session';
import StoreService from '../services/store';

interface StockItem {
  SKU: string;
  'Item Name': string;
  oldSKU: string;
  oldName: string;
  'Old Stock': number;
  'Incoming Stock': number;
  'Initial Stock': number;
  Rate: string;
  'Purchase Rate': string;
  Description: string;
}

interface StockResponse {
  message: string;
  items?: StockItem[];
  error?: string;
}

interface ModelResponse {
  stock: StockResponse;
  nextNumber: string;
}

export default class UpdatestockRoute extends Route {
  @service declare store: StoreService;
  @service declare session: SessionService;

  async model(): Promise<ModelResponse> {
    const stock = await this.store.ajax('/getnewstock');
    const nextNumber = await this.store.ajax('/itemcustomfields').then(json => {
      return json.custom_fields.find((cf: any) => cf.data_type === 'autonumber').value;
    });

    return RSVP.hash({ stock, nextNumber });
  }

  setupController(controller: any, { stock, nextNumber }: ModelResponse): void {
    if (stock.message === 'success') {
      const items = stock.items || [];
      let newNumber: string;
      let sku: string;
      let itemName: string;
      let currentItem: any;
      let oldStock: number;
      let incomingStock: number;
      let newStock: number;
      let oldSKU: string;
      let oldName: string;
      const printItems = [];
      const itemslist = this.session.itemslist;

      items.forEach((item) => {
        sku = item.SKU;
        itemName = item['Item Name'];
        oldStock = 0;
        incomingStock = Number(item['Initial Stock']);
        newStock = incomingStock;
        oldSKU = '';
        oldName = '';

        if (Number(sku) > 16440) {
          newNumber = getItemName(`${nextNumber++}`);
          item['Item Name'] = `${itemName.split('-')[0]}- ${newNumber}`;
          item.SKU = newNumber;
          oldSKU = sku;
          oldName = itemName;
          printItems.push({
            oldSKU: sku,
            SKU: newNumber,
            name: item.Description,
            Rate: item.Rate,
            StickerCount: incomingStock,
          });
        } else {
          currentItem = itemslist?.find(i => i.SKU === sku);
          if (currentItem) {
            oldStock = Number(currentItem['Initial Stock']);
            newStock = oldStock + incomingStock;
          }
        }

        item.oldSKU = oldSKU;
        item.oldName = oldName;
        item['Old Stock'] = oldStock;
        item['Incoming Stock'] = incomingStock;
        item['Initial Stock'] = newStock;
      });

      controller.setProperties({
        model: items,
        printItems,
        nextNumber,
        errorMessage: '',
      });
    } else {
      controller.set('errorMessage', stock.error);
    }
    controller.set('successMessage', '');
  }

  @action
  async save(): Promise<void> {
    const controller = this.controller;
    const body = {
      items: controller.model,
      printItems: controller.printItems,
    };

    controller.set('isSaving', true);
    controller.set('errorMessage', '');

    try {
      const json = await this.store.ajax('/updatestock', { method: 'POST', body });
      
      if (json.message === 'success') {
        controller.set('model', []);
        if (isPresent(controller.printItems)) {
          controller.set(
            'successMessage',
            'Print Items found. Import importitem csv file into Zoho Books and print sticker from Barcode option'
          );
        }
      } else if (json.message === 'failure') {
        controller.set('errorMessage', json.error);
      }
    } finally {
      controller.set('isSaving', false);
    }
  }
}