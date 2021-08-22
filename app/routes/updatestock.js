import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import getItemName from '../utils/get-item-name';
export default Route.extend({
  store: service(),
  session: service(),
  model() {
    let stock = this.store.ajax('/getnewstock').then((json) => {
      return json;
    });
    let nextNumber = this.store.ajax('/itemcustomfields').then((json) => {
      return json.custom_fields.findBy('data_type', 'autonumber').value;
    });
    return RSVP.hash({stock, nextNumber});
  },
  setupController (controller, {stock, nextNumber}){
    if(stock.message === 'success') {
      let items = stock.items;
      let newNumber,sku,itemName,currentItem,oldStock, incomingStock, newStock,oldSKU,oldName;
      let printItems = [];
      let itemslist = this.session.itemslist;
      items.forEach((item) => {
        sku = item.SKU;
        itemName = item['Item Name'];
        oldStock = 0;
        incomingStock = Number(item['Initial Stock']);
        newStock = incomingStock;
        oldSKU = '';
        oldName = '';
        if(Number(sku) > 16440) {
          newNumber = getItemName(`${nextNumber++}`);
          item['Item Name'] = `${itemName.split('-')[0]}- ${newNumber}`
          item.SKU = newNumber;
          oldSKU = sku;
          oldName = itemName;
          printItems.push({
            oldSKU: sku, SKU: newNumber, name: item.Description, Rate: item.Rate, StickerCount: incomingStock
          });
        } else {
          currentItem = itemslist.findBy('SKU', sku);
          if(currentItem) {
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
  },
  actions: {
    save() {
      let controller = this.controller;
      let body = {
        items: controller.model,
        printItems: controller.printItems
      };
      controller.set('isSaving', true);
      controller.set('errorMessage', '');
      this.store.ajax('/updatestock', { method: 'POST', body }).then((json) => {
        if (json.message === 'success') {
          controller.set('model', []);
          if(isPresent(controller.printItems)) {
            controller.set('successMessage', 'Print Items found. Import importitem csv file into Zoho Books and print sticker from Barcode option');
          }
        } else if (json.message === 'failure') {
          controller.set('errorMessage', json.error);
        }
      }).finally(() => {
        controller.set('isSaving', false);
      });
    },
  }
});
