import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import getItemName from '../utils/get-item-name';

export default class UpdateStockRoute extends Route {
  @service store;
  @service session;

  async model() {
    const stock = await this.store.ajax('/getnewstock');
    const nextNumber = await this.store.ajax('/itemcustomfields')
      .then(json => json.custom_fields.findBy('data_type', 'autonumber').value);

    return { stock, nextNumber };
  }

  setupController(controller, { stock, nextNumber }) {
    if (stock.message === 'success') {
      const items = stock.items;
      const printItems = [];
      const itemslist = this.session.itemslist;

      items.forEach((item) => {
        const sku = item.SKU;
        const itemName = item['Item Name'];
        let oldStock = 0;
        const incomingStock = Number(item['Initial Stock']);
        let newStock = incomingStock;
        let oldSKU = '';
        let oldName = '';

        if (Number(sku) > 16440) {
          const newNumber = getItemName(`${nextNumber++}`);
          item['Item Name'] = `${itemName.split('-')[0]}- ${newNumber}`;
          item.SKU = newNumber;
          oldSKU = sku;
          oldName = itemName;
          printItems.push({
            oldSKU: sku,
            SKU: newNumber,
            name: item.Description,
            Rate: item.Rate,
            StickerCount: incomingStock
          });
        } else {
          const currentItem = itemslist.findBy('SKU', sku);
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
      controller.errorMessage = stock.error;
    }
    controller.successMessage = '';
  }
}